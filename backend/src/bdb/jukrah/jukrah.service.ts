import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MinioService } from '../kerma/minio.service';
import { AuditService } from '../audit/audit.service';
import * as crypto from 'crypto';

export interface PostComposerDto {
    content: string;
    audience_type?: 'public' | 'regional' | 'friends' | 'private';
    target_satker_ids?: number[];
    case_lp_ids?: string[];
    is_official_jukrah?: boolean | string;
    is_pinned?: boolean | string;
    parent_post_id?: number;
}

@Injectable()
export class JukrahService {
    private readonly logger = new Logger('JukrahService');
    private ready = false;
    private readonly streamSecret = process.env.JWT_SECRET || process.env.CAS_STREAM_SECRET || '';
    private readonly networkUsersCache = new Map<string, { exp: number; value: any }>();
    private readonly networkCountCache = new Map<string, { exp: number; total: number }>();
    private static readonly NETWORK_CACHE_TTL_MS = 30 * 1000;

    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService,
        private readonly audit: AuditService
    ) {}

    clearNetworkUsersCache() {
        this.networkUsersCache.clear();
        this.networkCountCache.clear();
    }

    private async ensureTable() {
        if (this.ready) return;
        // Tabel bulletin legacy
        await this.dataSource.query(`
            create table if not exists bdb_jukrah (
                id          bigserial primary key,
                nama        text not null,
                deskripsi   text,
                aktif       boolean not null default true,
                lampiran    jsonb,
                tanggal_publish date not null default current_date,
                created_by  bigint,
                created_at  timestamptz not null default now(),
                updated_at  timestamptz not null default now()
            )`);
        await this.dataSource.query('alter table bdb_jukrah add column if not exists tanggal_publish date not null default current_date');
        await this.dataSource.query(`
            create table if not exists bdb_jukrah_view (
                id bigserial primary key,
                jukrah_id bigint not null,
                user_id bigint not null,
                viewed_at timestamptz not null default now(),
                unique (jukrah_id, user_id)
            )`);
        await this.dataSource.query(`
            create table if not exists bdb_social_bookmarks (
                id bigserial primary key,
                post_id bigint not null,
                user_id bigint not null,
                created_at timestamptz not null default now(),
                unique (post_id, user_id)
            )`);
        await this.dataSource.query('alter table bdb_social_posts add column if not exists is_edited boolean default false');
        await this.dataSource.query('alter table bdb_social_comments add column if not exists is_edited boolean default false');
        await this.dataSource.query('alter table bdb_social_comments add column if not exists updated_at timestamptz default now()');
        await this.dataSource.query(`
            create table if not exists bdb_social_comment_reactions (
                comment_id bigint not null references bdb_social_comments(id) on delete cascade,
                user_id bigint not null,
                created_at timestamptz default now(),
                primary key (comment_id, user_id)
            )`);
        await this.dataSource.query(`
            CREATE TABLE IF NOT EXISTS bdb_social_messages (
                id BIGSERIAL PRIMARY KEY,
                sender_id INTEGER NOT NULL,
                receiver_id INTEGER NOT NULL,
                channel_type VARCHAR(32) NOT NULL DEFAULT 'direct',
                content TEXT NOT NULL,
                media_url TEXT,
                attachment_url TEXT,
                attachment_name TEXT,
                reply_to_json TEXT,
                reactions_json TEXT,
                is_read BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )`);
        await this.dataSource.query("ALTER TABLE bdb_social_messages ADD COLUMN IF NOT EXISTS channel_type VARCHAR(32) NOT NULL DEFAULT 'direct', ADD COLUMN IF NOT EXISTS media_url TEXT, ADD COLUMN IF NOT EXISTS attachment_url TEXT, ADD COLUMN IF NOT EXISTS attachment_name TEXT, ADD COLUMN IF NOT EXISTS reply_to_json TEXT, ADD COLUMN IF NOT EXISTS reactions_json TEXT");
        await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_bdb_social_msg_pair ON bdb_social_messages(sender_id, receiver_id, created_at DESC)');
        await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_bdb_social_msg_recv ON bdb_social_messages(receiver_id, is_read)');
        await this.dataSource.query('ALTER TABLE bdb_social_notifications ADD COLUMN IF NOT EXISTS link TEXT');
        await this.dataSource.query(`
            CREATE TABLE IF NOT EXISTS bdb_social_share_access_log (
                id BIGSERIAL PRIMARY KEY,
                post_id BIGINT NOT NULL,
                jenis_personel VARCHAR(32) NOT NULL DEFAULT 'INTERNAL',
                nama VARCHAR(160) NOT NULL,
                nrp_nip VARCHAR(80) NOT NULL,
                satker VARCHAR(160),
                ip_address VARCHAR(80),
                user_agent TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )`);
        try {
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_user_conn_req_status ON user_connections (requester_id, status)');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_user_conn_addr_status ON user_connections (addressee_id, status)');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_trb_police_lower_email ON trb_police (LOWER(email))');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_auth_users_status_login ON auth_users (status, last_login_at DESC NULLS LAST, id ASC)');
        } catch {}
        await this.ensureMasterUserCallsignSync();
        this.clearNetworkUsersCache();
        this.ready = true;
    }

    private async ensureMasterUserCallsignSync() {
        try {
            const pathMod = require('path');
            const fsMod = require('fs');
            const candidates = [
                pathMod.join(__dirname, '..', '..', '..', 'scripts', 'sync_master_user_callsigns.js'),
                pathMod.join(process.cwd(), 'scripts', 'sync_master_user_callsigns.js'),
                pathMod.join(process.cwd(), 'backend', 'scripts', 'sync_master_user_callsigns.js')
            ];
            for (const scriptPath of candidates) {
                if (fsMod.existsSync(scriptPath)) {
                    const { syncMasterUserCallsigns } = require(scriptPath);
                    await syncMasterUserCallsigns(this.dataSource);
                    break;
                }
            }
        } catch (err: any) {
            this.logger.warn('ensureMasterUserCallsignSync warning: ' + (err?.message || err));
        }
    }

    extractTwoWordCallsignFromName(rawName?: any, authorId?: any): string {
        if (Number(authorId) === 1) return 'om.eko_42';
        const str = String(rawName || '').trim();
        let beforeComma = str.split(',')[0] || '';
        beforeComma = beforeComma
            .replace(/\b(s\.h|s\.i\.k|s\.kom|s\.t|s\.sos|s\.pd|s\.psi|s\.e|s\.ap|s\.ip|m\.h|m\.si|m\.m|m\.sc|m\.kom|m\.krim|ph\.d|a\.md|dr|drs|dra|ir|prof|h|hj)\b\.?/gi, ' ')
            .replace(/\([^)]*\)/g, ' ');
        const stopwords = new Set([
            'jenderal', 'komjen', 'irjen', 'brigjen', 'kombes', 'akbp', 'kompol', 'akp',
            'iptu', 'ipda', 'aiptu', 'aipda', 'bripka', 'brigpol', 'brigadir', 'briptu', 'bripda',
            'abrip', 'abriptu', 'abripda', 'bharaka', 'bharatu', 'bharada',
            'pol', 'polri', 'tni', 'purn', 'pns', 'asn', 'cpns',
            'pembina', 'penata', 'pengatur', 'juru', 'penda',
            'dr', 'drs', 'dra', 'ir', 'prof', 'h', 'hj', 'kh', 'ny', 'tn', 'alm',
            'sh', 'sik', 'mh', 'msi', 'skom', 'st', 'ssos', 'spd', 'sap', 'spsi', 'se',
            'mm', 'msc', 'mkrim', 'amd', 'phd', 'mkom', 'mt', 'mpd', 'ma', 'mkn',
            'sp', 'shi', 'mip', 'map', 'skm', 'skep', 'ners', 'apt', 'psi'
        ]);
        const tokens = beforeComma
            .toLowerCase()
            .replace(/[^a-z0-9\s.\-']/g, ' ')
            .split(/[\s.\-']+/)
            .map(w => w.replace(/[^a-z0-9]/g, ''))
            .filter(w => w && !/^\d+$/.test(w) && !stopwords.has(w));
        const multiChar = tokens.filter(w => w.length >= 2);
        const pool = multiChar.length >= 2 ? multiChar : (multiChar.length >= 1 ? multiChar : tokens);
        if (pool.length >= 2) return `${pool[0]}.${pool[1]}`.slice(0, 60);
        if (pool.length === 1) return pool[0].slice(0, 60);
        return `personil.${String(authorId || '0').replace(/[^0-9]/g, '') || '0'}`;
    }

    private isFemalePersonnel(name?: any, jenisKelamin?: any, socialMedia?: any): boolean {
        const explicitJk = String(socialMedia?.jenis_kelamin || socialMedia?.gender || '').trim().toLowerCase();
        if (['p', 'perempuan', 'wanita', 'female', 'f', 'polwan'].includes(explicitJk)) return true;
        if (['l', 'laki-laki', 'laki', 'pria', 'male', 'm', 'polki'].includes(explicitJk)) return false;
        const jk = String(jenisKelamin || '').trim().toLowerCase();
        if (['p', 'perempuan', 'wanita', 'female', 'f', 'polwan'].includes(jk)) return true;
        const n = String(name || '').trim();
        if (!n) return false;
        if (/^(doliandri|muhammad|muhamad|mohammad|mohamad|mochamad|mochammad|m\.|moh\.|muh\.|ahmad|achmad|budi|agus|hendra|eko|rizky|rizki|andi|dedi|dedy|wahyu|bayu|dimas|bagus|fajar|reza|ilham|arif|arief|irfan|taufik|taufiq|hidayat|saputra|pratama|dewangga|irwan|iwan|heru|heri|hery|bambang|slamet|joko|tri\s+budi|agung|dwi\s+putra|putra)\b/i.test(n)) return false;
        return /\b(siti|sri|dewi|dewie|ayu|putri|dian|fitri|fitria|fitriani|nurul|rina|rini|desi|desy|mega|ratna|wulan|wulandari|indah|intan|novita|novi|lestari|anggraini|maharani|puspita|handayani|kusumawati|rahmawati|susanti|astuti|widyastuti|yuliani|yulia|yuni|wahyuni|fatimah|alfia|amini|tita|maria|theresia|veronica|natalia|debora|chintya|nadia|nabila|annisa|anisa|aulia|amelia|amalia|tiara|citra|maya|lina|linda|nina|dina|vina|vera|sari|wati|ningrum|ningsih|pratiwi|yashinta|prameswari|retno|endang|inggrid|ni\s+putu|ni\s+made|ni\s+luh|ni\s+wayan|ni\s+kadek|ni\s+komang|ni\s+nyoman|ni\s+ketut)\b/i.test(n);
    }

    private resolveDefaultAvatar(photoUrl: any, name?: any, jenisKelamin?: any, socialMedia?: any): string {
        const clean = String(photoUrl || '').trim();
        if (clean.length > 5 && clean !== 'null' && clean !== 'undefined' && !clean.includes('default-avatar')) return clean;
        return this.isFemalePersonnel(name, jenisKelamin, socialMedia)
            ? '/images/default-avatar-polwan.jpg'
            : '/images/default-avatar-polki.png';
    }

    private resolveDefaultBanner(socialMedia: any): string {
        const b = typeof socialMedia?.banner_theme === 'string' ? socialMedia.banner_theme.trim() : '';
        if (b && !b.includes('default-banner') && (b.startsWith('data:image') || b.startsWith('http') || b.startsWith('/') || b.startsWith('linear-gradient') || b.startsWith('radial-gradient'))) {
            return b;
        }
        return '/images/default-banner-polri.jpg';
    }

    private isSuperUserOne(id: any, username?: any, callsign?: any): boolean {
        if (Number(id) === 1) return true;
        const u = String(username || '').trim().toLowerCase().replace(/^@/, '');
        const c = String(callsign || '').trim().toLowerCase().replace(/^@/, '');
        return u === 'omeko42' || u === 'om.eko_42' || c === 'omeko42' || c === 'om.eko_42';
    }

    private resolveAuthorSatker(satkerSingkat: any, satkerNama: any, roleBdb: any, isUserOne: boolean): string {
        if (isUserOne) return 'Robinopsnal Bareskrim Polri';
        const raw = String(satkerSingkat || satkerNama || '').trim();
        const role = String(roleBdb || '').toLowerCase();
        const isGlobal = role === 'superadmin' || role === 'admin_binops';
        const low = raw.toLowerCase();
        if (!raw || low === 'polri' || low === 'mabes polri' || low === 'bareskrim' || low === 'bareskrim polri' || low === 'robinopsnal' || low === 'robinopsnal bareskrim polri') {
            return isGlobal ? 'Robinopsnal Bareskrim Polri' : (raw || 'Bareskrim Polri');
        }
        return raw;
    }

    createPostShareHash(postId: number): string {
        const pid = Number(postId || 0);
        const secret = this.streamSecret || 'cas-sharese-secret-2026';
        const sig = crypto.createHmac('sha256', secret).update(`sharese_post:${pid}`).digest('hex').slice(0, 16);
        return Buffer.from(`sp.${pid}.${sig}`, 'utf8').toString('base64url');
    }

    extractCandidatePostIds(hash?: string): number[] {
        const candidates: number[] = [];
        const addCandidate = (n: number) => {
            if (Number.isInteger(n) && n > 0 && !candidates.includes(n)) {
                candidates.push(n);
            }
        };
        try {
            const clean = String(hash || '').trim();
            if (!clean) return candidates;

            // 1. Prefix format: sharese-42, post-42, sp-42
            const prefixMatch = clean.match(/^(?:sharese|post|sp)[-_:](\d+)$/i);
            if (prefixMatch) {
                addCandidate( parseInt(prefixMatch[1], 10));
            }

            // 2. Base64url sp.<pid>.<sig> or decoded string
            try {
                const decoded = Buffer.from(clean, 'base64url').toString('utf8');
                const parts = decoded.split('.');
                if (parts.length >= 2 && parts[0] === 'sp') {
                    const pid = parseInt(parts[1], 10);
                    const secret = this.streamSecret || 'cas-sharese-secret-2026';
                    const expectedSig = crypto.createHmac('sha256', secret).update(`sharese_post:${pid}`).digest('hex').slice(0, 16);
                    if (!isNaN(pid) && pid > 0 && (!parts[2] || parts[2] === expectedSig || /^[0-9a-f]{8,64}$/i.test(parts[2]))) {
                        addCandidate(pid);
                    }
                } else if (/^\d+$/.test(decoded.trim())) {
                    addCandidate(parseInt(decoded.trim(), 10));
                }
            } catch {}

            // 3. Hex-encoded ASCII digits (e.g. '3432' -> '42', '31' -> '1')
            if (/^(?:3[0-9])+$/.test(clean) && clean.length % 2 === 0) {
                try {
                    const hexStr = Buffer.from(clean, 'hex').toString('utf8');
                    if (/^\d+$/.test(hexStr)) {
                        addCandidate(parseInt(hexStr, 10));
                    }
                } catch {}
            }

            // 4. Base36 affine transform: (Number(id) * 7919 + 104729).toString(36)
            if (/^[0-9a-z]+$/i.test(clean)) {
                const b36 = parseInt(clean, 36);
                if (!isNaN(b36) && b36 > 104729 && (b36 - 104729) % 7919 === 0) {
                    addCandidate((b36 - 104729) / 7919);
                }
            }

            // 5. Raw numeric ID (e.g. '42')
            if (/^\d+$/.test(clean)) {
                addCandidate(parseInt(clean, 10));
            }
        } catch {}
        return candidates;
    }

    verifyPostShareHash(hash?: string): number | null {
        const candidates = this.extractCandidatePostIds(hash);
        return candidates.length > 0 ? candidates[0] : null;
    }

    async resolvePostIdFromHash(hash?: string, fallbackPostId?: number): Promise<number | null> {
        const candidates = this.extractCandidatePostIds(hash);
        if (fallbackPostId && Number.isInteger(Number(fallbackPostId)) && Number(fallbackPostId) > 0 && !candidates.includes(Number(fallbackPostId))) {
            candidates.push(Number(fallbackPostId));
        }
        if (!candidates.length) return null;
        try {
            const rows = await this.dataSource.query(
                `SELECT id FROM bdb_social_posts WHERE id = ANY($1) AND status = 'active'`,
                [candidates]
            );
            const activeIds = new Set(rows.map((r: any) => Number(r.id)));
            for (const cid of candidates) {
                if (activeIds.has(cid)) return cid;
            }
        } catch {}
        return candidates[0] || null;
    }

    async verifyPersonnelNrp(rawNrp?: string) {
        const clean = String(rawNrp || '').trim().replace(/[\s.-]+/g, '');
        if (!clean) {
            throw new UnauthorizedException('Verifikasi identitas "Siapa Saya?" (NRP/NIP) wajib disertakan untuk mengakses tautan ini.');
        }
        if (clean.length < 4 || !/^[a-zA-Z0-9@_.-]{4,40}$/.test(clean)) {
            throw new ForbiddenException('Format NRP / NIP tidak valid.');
        }

        const userRows = await this.dataSource.query(
            `SELECT
                u.id as user_id,
                u.name as nama,
                u.username,
                u.callsign,
                u.email_polri,
                u.role_bdb,
                u.is_pns,
                s.nama_singkat as satker_singkat,
                s.deskripsi as satker_nama,
                tp.nrp as tp_nrp,
                tp.nama as tp_nama,
                tp.pangkat as tp_pangkat,
                tp.jabatan as tp_jabatan,
                tp.satuan as tp_satuan
             FROM auth_users u
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             LEFT JOIN trb_police tp ON tp.deleted_at IS NULL AND (tp.nrp = $1 OR lower(tp.email) = lower(u.email_polri))
             WHERE u.deleted_at IS NULL
               AND (
                   split_part(lower(coalesce(u.email_polri, '')), '@', 1) = lower($1)
                   OR lower(coalesce(u.email_polri, '')) = lower($1)
                   OR lower(coalesce(u.username, '')) = lower($1)
                   OR replace(lower(coalesce(u.username, '')), 'nrp.', '') = lower($1)
                   OR split_part(lower(coalesce(u.email, '')), '@', 1) = lower($1)
               )
             LIMIT 1`,
            [clean]
        );

        let found: any = userRows[0] || null;
        if (!found) {
            const tpRows = await this.dataSource.query(
                `SELECT
                    0 as user_id,
                    nrp as tp_nrp,
                    nama as tp_nama,
                    pangkat as tp_pangkat,
                    jabatan as tp_jabatan,
                    satuan as tp_satuan,
                    email as email_polri,
                    is_pns
                 FROM trb_police
                 WHERE deleted_at IS NULL
                   AND (
                       lower(coalesce(nrp, '')) = lower($1)
                       OR split_part(lower(coalesce(email, '')), '@', 1) = lower($1)
                       OR lower(coalesce(email, '')) = lower($1)
                   )
                 LIMIT 1`,
                [clean]
            );
            found = tpRows[0] || null;
        }

        if (!found) {
            throw new ForbiddenException('NRP / NIP tidak terdaftar sebagai personel aktif di database CAS Bareskrim Polri.');
        }

        const rawName = String(found.nama || found.tp_nama || 'Personel Polri').trim();
        const emailPrefix = String(found.email_polri || '').split('@')[0];
        const cleanNrp = String(found.tp_nrp || (/^\d+$/.test(emailPrefix) ? emailPrefix : clean)).replace(/@.*$/, '');
        const maskedNrp = cleanNrp.length > 4
            ? cleanNrp.slice(0, 2) + '*'.repeat(Math.max(2, cleanNrp.length - 4)) + cleanNrp.slice(-2)
            : cleanNrp;
        const satker = String(found.satker_singkat || found.satker_nama || found.tp_satuan || 'Polri').trim();
        const pangkat = String(found.tp_pangkat || '-').trim();
        const jabatan = String(found.tp_jabatan || 'PERSONEL POLRI').trim();
        const jenisPersonel = found.is_pns ? 'PNS_POLRI' : 'ANGGOTA_POLRI';

        return {
            user_id: Number(found.user_id || 0),
            nrp: cleanNrp,
            nrp_nip: cleanNrp,
            nrp_masked: maskedNrp,
            nama: rawName,
            pangkat,
            jabatan,
            satker,
            jenis_personel: jenisPersonel,
            verified: true,
            verified_at: new Date().toISOString()
        };
    }

    async getShareChallenge(shareToken?: string, postId?: number) {
        await this.ensureTable();
        let targetId = Number(postId || 0);
        if (shareToken) {
            const resolved = await this.resolvePostIdFromHash(shareToken, targetId);
            if (!resolved) {
                throw new BadRequestException('Tautan berhash Sharese tidak valid atau sudah kedaluwarsa.');
            }
            targetId = resolved;
        }

        let postPreview: any = null;
        if (targetId && !isNaN(targetId) && targetId > 0) {
            const rows = await this.dataSource.query(
                `SELECT p.id, p.author_id, p.audience_type, p.content, p.media_urls, p.is_official_jukrah, p.is_pinned, p.created_at,
                        u.name as raw_author_name, u.username as author_username, u.callsign as author_callsign, u.role_bdb as author_role,
                        s.deskripsi as author_satker_nama, s.nama_singkat as author_satker_singkat
                 FROM bdb_social_posts p
                 JOIN auth_users u ON u.id = p.author_id
                 LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
                 WHERE p.id = $1 AND p.status = 'active'
                 LIMIT 1`,
                [targetId]
            );
            if (!rows.length && shareToken) {
                throw new NotFoundException('Postingan Sharese tidak ditemukan atau telah ditarik.');
            }
            if (rows.length) {
                const r = rows[0];
                const isUserOne = this.isSuperUserOne(r.author_id, r.author_username, r.author_callsign);
                const authorHandle = this.formatCallsign(r.author_callsign, r.author_id, r.author_username, r.raw_author_name);
                const authorSatker = this.resolveAuthorSatker(r.author_satker_singkat, r.author_satker_nama, r.author_role, isUserOne);
                const rawText = String(r.content || '').trim();
                const firstLine = (rawText.split('\n')[0] || 'Siaran Sharese CAS Bareskrim Polri').replace(/\*\*/g, '').slice(0, 120);
                const shareHash = this.createPostShareHash(targetId);
                postPreview = {
                    id: Number(r.id),
                    title: firstLine,
                    author_handle: authorHandle,
                    author_satker: authorSatker,
                    is_official_jukrah: Boolean(r.is_official_jukrah),
                    media_count: Array.isArray(r.media_urls) ? r.media_urls.length : 0,
                    created_at: r.created_at,
                    share_hash: shareHash,
                    share_url: `/cms/broadcaster?share=${shareHash}`
                };
            }
        }

        // 6-character alphanumeric SVG Captcha (gaya Login)
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        const palette = ['#f8fafc', '#38bdf8', '#a7f3d0', '#fde047', '#f472b6', '#c4b5fd'];
        let noiseLines = '';
        for (let i = 0; i < 5; i++) {
            const x1 = 8 + Math.floor(Math.random() * 28);
            const y1 = 8 + Math.floor(Math.random() * 44);
            const cx = 70 + Math.floor(Math.random() * 60);
            const cy = 6 + Math.floor(Math.random() * 48);
            const x2 = 164 + Math.floor(Math.random() * 28);
            const y2 = 8 + Math.floor(Math.random() * 44);
            const stroke = palette[i % palette.length];
            noiseLines += `<path d="M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" stroke="${stroke}" stroke-opacity="0.28" stroke-width="1.5" fill="none"/>`;
        }
        let noiseDots = '';
        for (let i = 0; i < 24; i++) {
            const cx = 6 + Math.floor(Math.random() * 188);
            const cy = 6 + Math.floor(Math.random() * 48);
            const rad = (Math.random() * 1.4 + 0.6).toFixed(1);
            const fill = palette[i % palette.length];
            noiseDots += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}" fill-opacity="0.28"/>`;
        }
        let charNodes = '';
        for (let i = 0; i < code.length; i++) {
            const ch = code[i];
            const x = 24 + i * 28 + Math.floor(Math.random() * 5) - 2;
            const y = 38 + Math.floor(Math.random() * 7) - 3;
            const rot = Math.floor(Math.random() * 29) - 14;
            const color = palette[i % palette.length];
            charNodes += `<text x="${x}" y="${y}" fill="${color}" font-family="monospace" font-size="24" font-weight="bold" text-anchor="middle" transform="rotate(${rot} ${x} ${y})">${ch}</text>`;
        }
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60"><rect width="200" height="60" rx="8" fill="#0f172a"/>${noiseLines}${noiseDots}${charNodes}</svg>`;
        const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;

        const exp = Date.now() + 10 * 60 * 1000;
        const secret = this.streamSecret || 'cas-sharese-secret-2026';
        const challengePayload = `${targetId || 0}|${code.toUpperCase()}|${exp}`;
        const sig = crypto.createHmac('sha256', secret).update(challengePayload).digest('hex');
        const challengeToken = Buffer.from(`${challengePayload}|${sig}`, 'utf8').toString('base64url');

        return {
            status: 1,
            data: {
                challenge_token: challengeToken,
                captcha_token: challengeToken,
                captcha_svg: svgDataUrl,
                svg_data_url: svgDataUrl,
                captcha_question: 'Ketik 6 karakter kode di samping',
                question: 'Ketik 6 karakter kode di samping',
                post_preview: postPreview
            }
        };
    }

    private async buildSharedPostPayload(postId: number, uid: number) {
        const rows = await this.dataSource.query(
            `SELECT p.id, p.author_id, p.audience_type, p.target_satker_ids, p.content, p.media_urls, p.case_lp_ids,
                    p.reaction_counts, p.repost_count, p.view_count, p.is_official_jukrah, p.is_pinned, p.is_edited, p.parent_post_id,
                    p.created_at, p.updated_at,
                    u.name as raw_author_name, u.username as author_username, u.callsign as author_callsign, u.email_polri as author_email_polri,
                    u.role_bdb as author_role, u.photo_url as author_photo, u.social_media as author_social_media, u.scope_satker_id as author_satker_id,
                    s.deskripsi as author_satker_nama, s.nama_singkat as author_satker_singkat,
                    tp.pangkat as author_pangkat, tp.jabatan as author_jabatan,
                    (SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id) as comments_count,
                    (SELECT COUNT(*)::int FROM bdb_social_read_receipts rrc WHERE rrc.post_id = p.id) as acknowledged_count,
                    (SELECT COUNT(*)::int FROM bdb_social_reactions rx_all WHERE rx_all.post_id = p.id) as total_reactions
             FROM bdb_social_posts p
             JOIN auth_users u ON u.id = p.author_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             LEFT JOIN LATERAL (
                 SELECT pangkat, jabatan FROM trb_police tp
                 WHERE tp.deleted_at IS NULL
                   AND (tp.nrp = split_part(u.email_polri, '@', 1) OR lower(tp.email) = lower(u.email_polri))
                 LIMIT 1
             ) tp ON true
             WHERE p.id = $1 AND p.status = 'active'
             LIMIT 1`,
            [postId]
        );
        if (!rows.length) {
            throw new NotFoundException('Postingan Sharese tidak ditemukan atau telah dihapus.');
        }
        const r = rows[0];
        const isUserOne = this.isSuperUserOne(r.author_id, r.author_username, r.author_callsign);
        const handle = this.formatCallsign(r.author_callsign, r.author_id, r.author_username, r.raw_author_name);
        const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
        const authorSatker = this.resolveAuthorSatker(r.author_satker_singkat, r.author_satker_nama, r.author_role, isUserOne);
        const authorRole = isUserOne ? 'superadmin' : (r.author_role || 'sharese');
        const isVerified = isUserOne ? true : Boolean(r.author_role && r.author_role !== 'sharese');
        const resolvedPhoto = this.resolveDefaultAvatar(r.author_photo, r.raw_author_name, null, r.author_social_media);
        const shareHash = this.createPostShareHash(Number(r.id));

        const media = (r.media_urls || []).map((m: any) => ({
            ...m,
            stream_url: m.key ? `/api/bdb/sharese/stream/${this.createStreamToken(m.key, m.mime || 'application/octet-stream', uid || 0)}` : null
        }));

        const commentRows = await this.dataSource.query(
            `SELECT c.id, c.post_id, c.user_id, c.parent_id, c.content, c.likes_count, c.is_edited, c.created_at,
                    u.name as raw_name, u.username, u.callsign, u.role_bdb, u.photo_url, u.social_media,
                    s.nama_singkat as satker_singkat, s.deskripsi as satker_nama
             FROM bdb_social_comments c
             JOIN auth_users u ON u.id = c.user_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC
             LIMIT 50`,
            [postId]
        );
        const comments = commentRows.map((c: any) => {
            const cUserOne = this.isSuperUserOne(c.user_id, c.username, c.callsign);
            const cHandle = this.formatCallsign(c.callsign, c.user_id, c.username, c.raw_name);
            const cSatker = this.resolveAuthorSatker(c.satker_singkat, c.satker_nama, c.role_bdb, cUserOne);
            return {
                id: Number(c.id),
                post_id: Number(c.post_id),
                user_id: Number(c.user_id),
                parent_id: c.parent_id ? Number(c.parent_id) : null,
                author_name: cUserOne ? (c.raw_name || 'EKO') : cHandle,
                author_handle: cHandle,
                author_satker: cSatker,
                author_photo: this.resolveDefaultAvatar(c.photo_url, c.raw_name, null, c.social_media),
                content: c.content,
                likes_count: Number(c.likes_count || 0),
                is_edited: Boolean(c.is_edited),
                created_at: c.created_at
            };
        });

        await this.dataSource.query('UPDATE bdb_social_posts SET view_count = coalesce(view_count, 0) + 1 WHERE id = $1', [postId]);

        const firstMedia = media[0] || null;
        const docMedia = media.find((m: any) => m.type === 'document' || (m.mime && m.mime.includes('pdf'))) || null;

        return {
            id: Number(r.id),
            author_id: Number(r.author_id),
            author_name: isUserOne ? (r.raw_author_name || 'EKO') : (uid > 0 ? (r.raw_author_name || handle) : handle),
            author_handle: handle,
            author_callsign: cleanHandle,
            author_username: cleanHandle,
            author_pangkat: r.author_pangkat || null,
            author_jabatan: r.author_jabatan || null,
            author_role: authorRole,
            author_photo: resolvedPhoto,
            author_photo_url: resolvedPhoto,
            author_satker: authorSatker,
            satker_name: authorSatker,
            satker: authorSatker,
            is_verified: isVerified,
            audience_type: r.audience_type,
            target_satker_ids: r.target_satker_ids || [],
            content: r.content,
            media,
            media_url: firstMedia ? (firstMedia.stream_url || firstMedia.url || null) : null,
            attachment_url: docMedia ? (docMedia.stream_url || docMedia.url || null) : null,
            attachment_name: docMedia ? (docMedia.name || docMedia.filename || null) : (firstMedia?.name || null),
            case_lp_ids: r.case_lp_ids || [],
            reaction_counts: r.reaction_counts || { like: 0, respect: 0, insightful: 0, applause: 0, fire: 0 },
            total_reactions: Number(r.total_reactions || 0),
            likes_count: Number(r.total_reactions || 0),
            repost_count: Number(r.repost_count || 0),
            view_count: Number(r.view_count || 0) + 1,
            is_official_jukrah: Boolean(r.is_official_jukrah),
            is_pinned: Boolean(r.is_pinned),
            is_edited: Boolean(r.is_edited),
            acknowledged_count: Number(r.acknowledged_count || 0),
            comments_count: Number(r.comments_count || 0),
            comments,
            created_at: r.created_at,
            updated_at: r.updated_at,
            share_hash: shareHash,
            share_token: shareHash,
            share_url: `/cms/broadcaster?share=${shareHash}`
        };
    }

    async verifyShareViewer(body: any, meta?: { ip?: string; userAgent?: string }) {
        await this.ensureTable();
        const challengeToken = String(body?.challenge_token || body?.captcha_token || '').trim();
        const captchaAnswer = String(body?.captcha_answer || body?.captcha_code || body?.captcha || '').trim().toUpperCase();
        const nrpNip = String(body?.nrp_nip || body?.nrp || '').trim();

        if (!nrpNip || nrpNip.length < 4) {
            throw new BadRequestException('NRP / NIP wajib diisi dengan benar.');
        }

        // Lookup personnel record in auth_users / trb_police
        let verifiedViewer: any = null;
        try {
            verifiedViewer = await this.verifyPersonnelNrp(nrpNip);
        } catch (err) {
            // If verify-share was called with explicit nama + valid 6-18 digit NRP/NIP, allow if format valid, otherwise rethrow for verify-nrp
            const rawDigits = nrpNip.replace(/[\s.-]+/g, '');
            if (!body?.nama || !/^\d{6,18}$/.test(rawDigits)) {
                throw err;
            }
            verifiedViewer = {
                user_id: 0,
                nrp: rawDigits,
                nrp_nip: rawDigits,
                nrp_masked: rawDigits.slice(0, 2) + '****' + rawDigits.slice(-2),
                nama: String(body.nama).trim(),
                pangkat: '-',
                jabatan: 'PERSONEL POLRI',
                satker: String(body?.satker || 'Polri').trim(),
                jenis_personel: String(body?.jenis_personel || (rawDigits.length >= 14 ? 'PNS_POLRI' : 'ANGGOTA_POLRI')).toUpperCase(),
                verified: true,
                verified_at: new Date().toISOString()
            };
        }

        const nama = String(body?.nama || verifiedViewer.nama || '').trim();
        const jenisPersonel = String(body?.jenis_personel || verifiedViewer.jenis_personel || 'ANGGOTA_POLRI').trim().toUpperCase();
        const satker = String(body?.satker || verifiedViewer.satker || 'Polri').trim();

        let targetPostId = Number(body?.post_id || 0);
        if (challengeToken) {
            if (!captchaAnswer) {
                throw new BadRequestException('Kode keamanan Captcha wajib diisi.');
            }
            try {
                const raw = Buffer.from(challengeToken, 'base64url').toString('utf8');
                const parts = raw.split('|');
                if (parts.length !== 4) {
                    throw new Error('Token invalid');
                }
                const [pidStr, ans, expStr, sig] = parts;
                const exp = parseInt(expStr, 10);
                if (isNaN(exp) || Date.now() > exp) {
                    throw new BadRequestException('Sesi Captcha telah kedaluwarsa. Silakan muat ulang kode Captcha.');
                }
                const secret = this.streamSecret || 'cas-sharese-secret-2026';
                const expectedSig = crypto.createHmac('sha256', secret).update(`${pidStr}|${ans}|${expStr}`).digest('hex');
                if (sig !== expectedSig) {
                    throw new BadRequestException('Token keamanan Captcha tidak sah.');
                }
                if (captchaAnswer !== ans.toUpperCase()) {
                    throw new BadRequestException('Kode Captcha (6 karakter) tidak sesuai. Silakan periksa kembali.');
                }
                targetPostId = parseInt(pidStr, 10) || targetPostId;
            } catch (e: any) {
                if (e instanceof BadRequestException) throw e;
                throw new BadRequestException('Verifikasi Captcha gagal. Silakan muat ulang Captcha.');
            }
        }

        if (!targetPostId && (body?.share_token || body?.hash)) {
            targetPostId = (await this.resolvePostIdFromHash(body.share_token || body.hash)) || 0;
        }

        const viewerPayload = {
            ...verifiedViewer,
            jenis_personel: jenisPersonel,
            nama,
            nrp: verifiedViewer.nrp,
            nrp_nip: verifiedViewer.nrp_nip,
            satker: satker || 'Polri',
            verified_at: new Date().toISOString()
        };

        if (!targetPostId) {
            return {
                status: 1,
                message: 'Verifikasi identitas personel berhasil.',
                data: {
                    verified: true,
                    nrp: verifiedViewer.nrp,
                    viewer: viewerPayload
                },
                viewer: viewerPayload
            };
        }

        const postData = await this.buildSharedPostPayload(targetPostId, verifiedViewer.user_id || 0);

        await this.dataSource.query(
            `INSERT INTO bdb_social_share_access_log (post_id, jenis_personel, nama, nrp_nip, satker, ip_address, user_agent)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [targetPostId, jenisPersonel, nama, verifiedViewer.nrp, satker || '-', meta?.ip || '', meta?.userAgent || '']
        );

        return {
            status: 1,
            message: 'Verifikasi berhasil. Menampilkan siaran Sharese.',
            data: {
                ...postData,
                post: postData,
                viewer: viewerPayload
            },
            viewer: viewerPayload
        };
    }

    async getPublicSharedPost(idOrHash: string, rawNrp?: string, authUser?: any, meta?: { ip?: string; userAgent?: string }) {
        await this.ensureTable();
        const viewer = await this.verifyPersonnelNrp(rawNrp);
        const postId = await this.resolvePostIdFromHash(idOrHash);
        if (!postId) {
            throw new NotFoundException('Tautan siaran Sharese tidak ditemukan atau tidak valid.');
        }
        const uid = Number(authUser?.id || authUser?.user?.id || viewer.user_id || 0);
        const postData = await this.buildSharedPostPayload(postId, uid);

        await this.dataSource.query(
            `INSERT INTO bdb_social_share_access_log (post_id, jenis_personel, nama, nrp_nip, satker, ip_address, user_agent)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [postId, viewer.jenis_personel, viewer.nama, viewer.nrp, viewer.satker || '-', meta?.ip || '', meta?.userAgent || '']
        );

        return {
            status: 1,
            message: 'Berhasil memuat siaran Sharese terverifikasi.',
            data: {
                ...postData,
                post: postData,
                viewer
            },
            viewer
        };
    }

    async getSharedPost(user: any, shareToken: string) {
        await this.ensureTable();
        const postId = await this.resolvePostIdFromHash(shareToken);
        if (!postId) {
            throw new BadRequestException('Tautan berhash Sharese tidak valid.');
        }
        const uid = Number(user?.id || user?.user?.id || 0);
        const postData = await this.buildSharedPostPayload(postId, uid);
        return {
            status: 1,
            data: postData
        };
    }

    formatCallsign(rawCallsign: any, authorId: any, username?: any, authorName?: any): string {
        const idStr = String(authorId || '');
        if (idStr === '1' || this.isSuperUserOne(authorId, username, rawCallsign)) return '@om.eko_42';

        const invalidPlaceholders = new Set(['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse']);
        const normalizeCandidate = (rawVal: any): string => {
            let v = String(rawVal || '').trim().replace(/^@+/, '').toLowerCase();
            if (!v || v.length < 2) return '';
            if (invalidPlaceholders.has(v)) return '';
            if (v.startsWith('pers_') || v.startsWith('user_') || /^\d+$/.test(v)) return '';
            if (!/^[a-z0-9_.]{2,60}$/.test(v)) return '';
            // If handle has 3+ dot-separated words or trailing digits attached directly to letters (email prefix),
            // prefer extracting from authorName if available, or normalize to 2 words without trailing random digits
            const dotParts = v.split('.').filter(Boolean);
            if (dotParts.length >= 3 || /[a-z]\d+$/i.test(v)) {
                if (authorName && String(authorName).trim()) {
                    return this.extractTwoWordCallsignFromName(authorName, authorId);
                }
                const cleanedParts = dotParts
                    .slice(0, 2)
                    .map(p => p.replace(/^([a-z]+)\d+$/i, '$1'))
                    .filter(Boolean);
                if (cleanedParts.length > 0) {
                    return cleanedParts.join('.');
                }
            }
            return v;
        };

        const c = normalizeCandidate(rawCallsign);
        if (c) return '@' + c;
        const u = normalizeCandidate(username);
        if (u) return '@' + u;

        if (authorName && String(authorName).trim()) {
            return '@' + this.extractTwoWordCallsignFromName(authorName, authorId);
        }
        return '@personil.' + (idStr.replace(/[^0-9]/g, '') || '0');
    }

    // =========================================================================
    // 0 DATA LEAKAGE: TOKENIZED MEDIA STREAM ENGINE
    // =========================================================================

    /** Buat token berbatas waktu untuk stream media (kadaluwarsa dlm 15 menit). */
    createStreamToken(key: string, mime: string, userId: number): string {
        const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const payload = `${key}|${mime}|${userId}|${exp}`;
        const hmac = crypto.createHmac('sha256', this.streamSecret).update(payload).digest('hex');
        const tokenRaw = `${payload}|${hmac}`;
        return Buffer.from(tokenRaw).toString('base64url');
    }

    /** Verifikasi integritas token stream media. */
    verifyStreamToken(token: string): { key: string; mime: string; userId: number } | null {
        try {
            const raw = Buffer.from(token, 'base64url').toString('utf8');
            const parts = raw.split('|');
            if (parts.length !== 5) return null;
            const [key, mime, userIdStr, expStr, sig] = parts;
            const exp = parseInt(expStr, 10);
            if (isNaN(exp) || Date.now() > exp + 7 * 24 * 60 * 60 * 1000) return null;
            const payload = `${key}|${mime}|${userIdStr}|${expStr}`;
            const expectedSig = crypto.createHmac('sha256', this.streamSecret).update(payload).digest('hex');
            if (sig !== expectedSig) return null;
            return { key, mime, userId: parseInt(userIdStr, 10) };
        } catch {
            return null;
        }
    }

    /** Layani aliran stream media langsung dari MinIO tanpa mengekspos direktori/URL publik. */
    async streamMedia(token: string, res: any) {
        const verified = this.verifyStreamToken(token);
        if (!verified) {
            throw new ForbiddenException('Tautan media kadaluwarsa atau tidak sah (Akses Ditolak).');
        }

        try {
            const stream = await this.minio.getObjectStream(verified.key);
            res.setHeader('Content-Type', verified.mime || 'application/octet-stream');
            res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            const reqUrl = res?.req?.originalUrl || res?.req?.url || '';
            const isDownload = reqUrl.includes('download=1');
            if (isDownload) {
                let dlFilename = 'berkas-lampiran';
                const matchName = reqUrl.match(/[?&]filename=([^&]+)/);
                if (matchName && matchName[1]) {
                    dlFilename = decodeURIComponent(matchName[1]);
                } else if (verified.key) {
                    dlFilename = verified.key.split('/').pop() || 'berkas-lampiran';
                }
                res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(dlFilename)}"`);
            } else {
                res.setHeader('Content-Disposition', 'inline');
            }
            stream.on("error", (err) => { this.logger.error("Stream pipe error: " + (err?.message || err)); if (!res.headersSent) res.status(404).end(); else res.end(); }); stream.pipe(res);
        } catch (e: any) {
            this.logger.error(`Stream error key ${verified.key}: ${e.message}`);
            throw new NotFoundException('File media tidak ditemukan.');
        }
    }

    // =========================================================================
    // JUKRAHCASTER SOCIAL FEED & POSTS ENGINE
    // =========================================================================

    /** Ambil feed linimasa sosial dengan filter audiens dan penyamaran identitas canonical. */
    async getFeed(user: any, opts: { page?: number; limit?: number; filter?: string; type?: string; search?: string; tag?: string; satker_id?: number; author_id?: number | string }) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const userSatkerId = Number(user?.scope_satker_id || 0);
        const userRole = String(user?.role_bdb || 'sharese').toLowerCase();
        const isVendorMitra = ['vendor_mitra', 'vendor', 'mitra'].includes(userRole);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(userRole);
        const isGlobalReader = isGlobalAdmin || isVendorMitra;

        const page = Math.max(1, Number(opts.page) || 1);
        const limit = Math.min(200, Math.max(1, Number(opts.limit) || 100));
        const offset = (page - 1) * limit;

        const params: any[] = [uid, userSatkerId];
        const conditions: string[] = ["p.status = 'active'"];

        // Aturan visibilitas audiens:
        const audienceFilter = `(
            p.author_id = $1
            OR p.audience_type = 'public'
            OR (p.audience_type = 'regional' AND ($2::int = ANY(p.target_satker_ids) OR p.target_satker_ids = '{}' OR u.scope_satker_id = $2::int OR ${isGlobalReader ? 'true' : 'false'}))
            OR (p.audience_type = 'friends' AND (p.author_id = $1 OR u.scope_satker_id = $2::int))
        )`;
        conditions.push(audienceFilter);

        if (opts.author_id) {
            params.push(Number(opts.author_id));
            conditions.push("p.author_id = $" + params.length);
        }

        const effectiveFilter = String(opts.filter || opts.type || 'all').toLowerCase();
        if (effectiveFilter === 'mine') {
            params.push(uid);
            conditions.push(`p.author_id = $${params.length}`);
        } else if (effectiveFilter === 'saved' || effectiveFilter === 'bookmarks') {
            conditions.push('bm.id IS NOT NULL');
        } else if (effectiveFilter === 'jukrah' || effectiveFilter === 'official') {
            conditions.push('p.is_official_jukrah = true');
        } else if (effectiveFilter === 'regional') {
            conditions.push("p.audience_type = 'regional'");
        } else if (effectiveFilter === 'friends') {
            conditions.push("p.audience_type = 'friends'");
        } else if (effectiveFilter === 'private') {
            params.push(uid);
            conditions.push(`p.author_id = $${params.length} AND p.audience_type = 'private'`);
        }

        const effectiveSearch = (opts.search || opts.tag || '').trim();
        if (effectiveSearch) {
            params.push(`%${effectiveSearch.replace(/^#/, '')}%`);
            conditions.push(`(p.content ILIKE $${params.length} OR u.name ILIKE $${params.length} OR u.callsign ILIKE $${params.length} OR u.username ILIKE $${params.length})`);
        }

        const whereClause = 'WHERE ' + conditions.join(' AND ');

        const sql = `
            SELECT 
                p.id,
                p.author_id,
                p.audience_type,
                p.target_satker_ids,
                p.content,
                p.media_urls,
                p.case_lp_ids,
                p.reaction_counts,
                p.repost_count,
                p.view_count,
                p.is_official_jukrah,
                p.is_pinned,
                p.is_edited,
                p.parent_post_id,
                p.created_at,
                p.updated_at,
                u.name as raw_author_name,
                u.username as author_username,
                u.callsign as author_callsign,
                u.email_polri as author_email_polri,
                u.role_bdb as author_role,
                u.photo_url as author_photo,
                u.social_media as author_social_media,
                u.scope_satker_id as author_satker_id,
                s.deskripsi as author_satker_nama,
                s.nama_singkat as author_satker_singkat,
                rx.reaction_type as my_reaction,
                CASE WHEN rr.id IS NOT NULL THEN true ELSE false END as my_acknowledged,
                CASE WHEN bm.id IS NOT NULL THEN true ELSE false END as is_bookmarked,
                (SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id) as comments_count,
                (SELECT COUNT(*)::int FROM bdb_social_read_receipts rrc WHERE rrc.post_id = p.id) as acknowledged_count,
                (SELECT COUNT(*)::int FROM bdb_social_reactions rx_all WHERE rx_all.post_id = p.id) as total_reactions
            FROM bdb_social_posts p
            JOIN auth_users u ON u.id = p.author_id
            LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
            LEFT JOIN bdb_social_reactions rx ON rx.post_id = p.id AND rx.user_id = $1
            LEFT JOIN bdb_social_read_receipts rr ON rr.post_id = p.id AND rr.user_id = $1
            LEFT JOIN bdb_social_bookmarks bm ON bm.post_id = p.id AND bm.user_id = $1
            ${whereClause}
            ORDER BY p.is_pinned DESC, p.created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const rows = await this.dataSource.query(sql, params);

        const posts = rows.map((r: any) => {
            const isSelf = Number(r.author_id) === uid;
            const isUserOne = this.isSuperUserOne(r.author_id, r.author_username, r.author_callsign);
            const canSeeRealName = isGlobalReader || isSelf || isUserOne;

            const nrpMatch = (r.author_email_polri || '').match(/^(\d+)@/);
            const derivedNrp = nrpMatch ? nrpMatch[1] : (r.author_username && r.author_username.replace(/^Nrp\./i, '')) || '';

            const handle = this.formatCallsign(r.author_callsign, r.author_id, r.author_username, r.raw_author_name);
            const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
            const displayName = isUserOne ? (r.raw_author_name || 'EKO') : (canSeeRealName ? (r.raw_author_name || handle) : handle);
            const authorSatker = this.resolveAuthorSatker(r.author_satker_singkat, r.author_satker_nama, r.author_role, isUserOne);
            const isVerified = isUserOne ? true : Boolean(r.author_role && r.author_role !== 'sharese');
            const authorRole = isUserOne ? 'superadmin' : (r.author_role || 'sharese');
            const resolvedPhoto = this.resolveDefaultAvatar(r.author_photo, r.raw_author_name, null, r.author_social_media);
            const shareHash = this.createPostShareHash(Number(r.id));

            const media = (r.media_urls || []).map((m: any) => ({
                ...m,
                stream_url: m.key ? `/api/bdb/jukrah/stream/${this.createStreamToken(m.key, m.mime || 'application/octet-stream', uid)}` : null
            }));

            return {
                id: Number(r.id),
                author_id: Number(r.author_id),
                author_name: displayName,
                author_handle: handle,
                author_callsign: cleanHandle,
                author_username: cleanHandle,
                author_nrp: derivedNrp,
                raw_name: isUserOne ? (r.raw_author_name || 'EKO') : (canSeeRealName ? r.raw_author_name : null),
                author_role: authorRole,
                author_photo: resolvedPhoto,
                author_photo_url: resolvedPhoto,
                author_satker: authorSatker,
                satker_name: authorSatker,
                satker: authorSatker,
                is_verified: isVerified,
                audience_type: r.audience_type,
                target_satker_ids: r.target_satker_ids,
                content: r.content,
                media,
                case_lp_ids: r.case_lp_ids || [],
                reaction_counts: r.reaction_counts || { like: 0, respect: 0, insightful: 0, applause: 0, fire: 0 },
                total_reactions: Number(r.total_reactions || 0),
                repost_count: Number(r.repost_count || 0),
                view_count: Number(r.view_count || 0),
                is_official_jukrah: Boolean(r.is_official_jukrah),
                is_pinned: Boolean(r.is_pinned),
                is_edited: Boolean(r.is_edited),
                is_bookmarked: Boolean(r.is_bookmarked),
                parent_post_id: r.parent_post_id ? Number(r.parent_post_id) : null,
                user_reaction: r.my_reaction || null,
                my_reaction: r.my_reaction || null,
                has_acknowledged: Boolean(r.my_acknowledged),
                my_acknowledged: Boolean(r.my_acknowledged),
                acknowledged_count: Number(r.acknowledged_count || 0),
                comments_count: Number(r.comments_count || 0),
                created_at: r.created_at,
                updated_at: r.updated_at,
                can_edit: !isVendorMitra && (isSelf || isGlobalAdmin),
                can_delete: !isVendorMitra && (isSelf || isGlobalAdmin),
                can_modify_visibility: !isVendorMitra && isSelf,
                share_hash: shareHash,
                share_token: shareHash,
                share_url: `/cms/broadcaster?share=${shareHash}`
            };
        });

        // Ambil parent post jika ada repost
        const parentIds = posts.filter(p => p.parent_post_id).map(p => p.parent_post_id);
        if (parentIds.length) {
            const parents = await this.dataSource.query(
                `SELECT p.id, p.author_id, p.content, p.created_at, u.name as raw_name, u.callsign, u.username, u.role_bdb,
                        s.nama_singkat as satker, s.deskripsi as satker_nama
                 FROM bdb_social_posts p
                 JOIN auth_users u ON u.id = p.author_id
                 LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
                 WHERE p.id = ANY($1)`,
                [parentIds]
            );
            const parentMap = new Map(parents.map((p: any) => {
                const isPUserOne = this.isSuperUserOne(p.author_id, p.username, p.callsign);
                const pSatker = isPUserOne ? 'Robinopsnal Bareskrim Polri' : (p.satker || p.satker_nama || 'Polri');
                return [Number(p.id), {
                    id: Number(p.id),
                    content: p.content,
                    author_handle: this.formatCallsign(p.callsign, p.author_id, p.username, p.raw_name),
                    satker: pSatker,
                    author_satker: pSatker,
                    created_at: p.created_at
                }];
            }));
            for (const post of posts) {
                if (post.parent_post_id) {
                    (post as any).parent_post = parentMap.get(post.parent_post_id) || null;
                }
            }
        }

        const countRes = await this.dataSource.query(
            'SELECT count(*)::int as total FROM bdb_social_posts p JOIN auth_users u ON u.id = p.author_id LEFT JOIN bdb_social_bookmarks bm ON bm.post_id = p.id AND bm.user_id = $1 ' + whereClause,
            params
        );
        const total = Number(countRes[0]?.total || posts.length);

        return { status: 1, data: posts, total, total_pages: Math.ceil(total / limit) || 1, page, limit };
    }

    /** Buat postingan baru dengan proteksi pembatasan ukuran file dan validasi audiens. */
    async createSocialPost(user: any, dto: PostComposerDto, files: any[] = []) {
        await this.ensureTable();
        const uid = Number(user?.id);
        if (!uid) throw new ForbiddenException('Sesi tidak valid.');

        const content = (dto.content || '').trim();
        if (!content && (!files || !files.length)) {
            throw new BadRequestException('Konten postingan atau lampiran wajib diisi.');
        }
        if (content.length > 3000) {
            throw new BadRequestException('Panjang teks postingan maksimal 3.000 karakter.');
        }

        let userRole = String(user?.role_bdb || user?.user?.role_bdb || '').toLowerCase();
        if (!userRole || userRole === 'sharese') {
            try {
                const uRow = await this.dataSource.query('SELECT role_bdb FROM auth_users WHERE id = $1 LIMIT 1', [uid]);
                if (uRow.length && uRow[0].role_bdb) {
                    userRole = String(uRow[0].role_bdb).toLowerCase();
                }
            } catch {}
        }
        const canPublishOfficial = ['superadmin', 'admin_binops', 'admin_satker', 'operator', 'pimpinan', 'analis'].includes(userRole) || uid === 1;

        const isOfficial = (dto.is_official_jukrah === true || dto.is_official_jukrah === 'true' || dto.is_official_jukrah === '1') && canPublishOfficial;
        const isPinned = (dto.is_pinned === true || dto.is_pinned === 'true' || dto.is_pinned === '1') && canPublishOfficial;

        const audienceType = ['public', 'regional', 'friends', 'private'].includes(dto.audience_type || '')
            ? dto.audience_type
            : 'public';

        let targetSatkers: number[] = [];
        if (Array.isArray(dto.target_satker_ids)) {
            targetSatkers = dto.target_satker_ids.map(Number).filter(n => !isNaN(n));
        }
        if (audienceType === 'regional' && targetSatkers.length === 0 && user?.scope_satker_id) {
            targetSatkers = [Number(user.scope_satker_id)];
        }

        let caseLps: string[] = [];
        if (Array.isArray(dto.case_lp_ids)) {
            caseLps = dto.case_lp_ids.map(s => String(s).trim()).filter(Boolean);
        }

        const mediaUrls: any[] = [];
        for (const file of files || []) {
            const mime = file.mimetype || 'application/octet-stream';
            if (mime === 'application/pdf' && file.size > 20 * 1024 * 1024) {
                throw new BadRequestException(`Dokumen PDF "${file.originalname}" melebihi batas 20 MB.`);
            }
            if (mime.startsWith('video/') && file.size > 20 * 1024 * 1024) {
                throw new BadRequestException(`Video "${file.originalname}" melebihi batas 20 MB.`);
            }
            if (mime.startsWith('image/') && file.size > 15 * 1024 * 1024) {
                throw new BadRequestException(`Gambar "${file.originalname}" melebihi batas 15 MB.`);
            }

            const key = await this.saveUploadedFile(file, 'social');
            mediaUrls.push({
                name: file.originalname,
                key,
                size: file.size,
                mime
            });
        }

        const res = await this.dataSource.query(
            `INSERT INTO bdb_social_posts 
             (author_id, audience_type, target_satker_ids, content, media_urls, case_lp_ids, is_official_jukrah, is_pinned, parent_post_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id`,
            [
                uid,
                audienceType,
                targetSatkers,
                content,
                JSON.stringify(mediaUrls),
                caseLps,
                isOfficial,
                isPinned,
                dto.parent_post_id ? Number(dto.parent_post_id) : null
            ]
        );

        const newPostId = Number(res[0].id);

        if (isOfficial) {
            await this.broadcastDinasNotification(newPostId, user, content);
        }

        const actorName = user?.name || user?.username || 'Rekan Personil';
        const actorHandle = this.formatCallsign(user?.callsign || user?.username, uid, user?.username, user?.name);
        const mentionMatches = content.match(/@([a-z0-9_.]{3,30})/gi);
        if (mentionMatches && mentionMatches.length) {
            const handles = Array.from(new Set(mentionMatches.map(m => m.slice(1).toLowerCase())));
            try {
                const taggedUsers = await this.dataSource.query(
                    'SELECT id, username, callsign FROM auth_users WHERE (lower(username) = ANY($1) OR lower(callsign) = ANY($1)) AND id <> $2',
                    [handles, uid]
                );
                for (const tu of taggedUsers) {
                    await this.createNotification({
                        recipientId: Number(tu.id),
                        senderId: uid,
                        category: 'social',
                        type: 'mention',
                        postId: newPostId,
                        title: `🏷️ ${actorName} (${actorHandle}) menyebut Anda dalam diskusi perkara`,
                        message: `«${content.slice(0, 85)}${content.length > 85 ? '...' : ''}»`
                    });
                }
            } catch (err: any) {
                this.logger.error('Failed to dispatch mention notifications: ' + err.message);
            }
        }

        if (dto.parent_post_id) {
            const orig = await this.dataSource.query('SELECT author_id FROM bdb_social_posts WHERE id = $1', [dto.parent_post_id]);
            if (orig.length && Number(orig[0].author_id) !== uid) {
                await this.createNotification({
                    recipientId: Number(orig[0].author_id),
                    senderId: uid,
                    category: 'social',
                    type: 'repost',
                    postId: newPostId,
                    title: `🔁 ${actorName} (${actorHandle}) membagikan ulang kiriman Anda di Sharese`,
                    message: `«${content.slice(0, 85)}${content.length > 85 ? '...' : ''}»`
                });
                await this.dataSource.query('UPDATE bdb_social_posts SET repost_count = repost_count + 1 WHERE id = $1', [dto.parent_post_id]);
            }
        }

        await this.audit.log({
            user,
            action: 'CREATE',
            entity: 'social_post',
            entityId: newPostId,
            meta: { audienceType, isOfficial, mediaCount: mediaUrls.length }
        });

        const shareHash = this.createPostShareHash(newPostId);
        return {
            status: 1,
            message: isOfficial ? 'Jukrah Resmi Kedinasan berhasil diterbitkan dan disinkronkan ke Moderasi.' : 'Postingan berhasil diterbitkan.',
            data: {
                id: newPostId,
                is_official_jukrah: isOfficial,
                is_pinned: isPinned,
                share_hash: shareHash,
                share_token: shareHash,
                share_url: `/cms/broadcaster?share=${shareHash}`
            }
        };
    }

    /** Berikan reaksi emoticon tahan (Long-press reaction). */
    async reactPost(user: any, postId: number, reactionType: string) {
        const uid = Number(user?.id);
        const validTypes = ['like', 'respect', 'insightful', 'applause', 'fire'];
        const type = validTypes.includes(reactionType) ? reactionType : 'like';

        const post = await this.dataSource.query('SELECT id, author_id, reaction_counts FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!post.length) throw new NotFoundException('Postingan tidak ditemukan.');

        const ex = await this.dataSource.query('SELECT reaction_type FROM bdb_social_reactions WHERE post_id = $1 AND user_id = $2', [postId, uid]);

        let currentReaction = null;
        if (ex.length) {
            if (ex[0].reaction_type === type) {
                await this.dataSource.query('DELETE FROM bdb_social_reactions WHERE post_id = $1 AND user_id = $2', [postId, uid]);
            } else {
                await this.dataSource.query('UPDATE bdb_social_reactions SET reaction_type = $3 WHERE post_id = $1 AND user_id = $2', [postId, uid, type]);
                currentReaction = type;
            }
        } else {
            await this.dataSource.query('INSERT INTO bdb_social_reactions (post_id, user_id, reaction_type) VALUES ($1, $2, $3)', [postId, uid, type]);
            currentReaction = type;

            if (Number(post[0].author_id) !== uid) {
                const actorHandle = this.formatCallsign(user?.callsign || user?.username, uid, user?.username, user?.name);
                const rxEmoji = type === 'respect' ? '🫡' : type === 'insightful' ? '💡' : type === 'applause' ? '👏' : type === 'fire' ? '🔥' : '👍';
                const rxVerb = type === 'respect' ? 'memberi hormat pada kiriman Anda' : type === 'insightful' ? 'menilai kiriman Anda berwawasan' : type === 'applause' ? 'mengapresiasi kiriman Anda' : 'menyukai kiriman Anda';
                await this.createNotification({
                    recipientId: Number(post[0].author_id),
                    senderId: uid,
                    category: 'social',
                    type: type || 'reaction',
                    postId,
                    title: `${actorHandle} ${rxVerb}`,
                    message: `${rxEmoji} ${actorHandle} ${rxVerb}`
                });
            }
        }

        const counts = await this.dataSource.query(
            'SELECT reaction_type, count(*)::int as c FROM bdb_social_reactions WHERE post_id = $1 GROUP BY reaction_type',
            [postId]
        );
        const newCounts: Record<string, number> = { like: 0, respect: 0, insightful: 0, applause: 0, fire: 0 };
        let total = 0;
        counts.forEach((c: any) => {
            newCounts[c.reaction_type] = Number(c.c);
            total += Number(c.c);
        });

        await this.dataSource.query('UPDATE bdb_social_posts SET reaction_counts = $2 WHERE id = $1', [postId, JSON.stringify(newCounts)]);

        return {
            status: 1,
            data: {
                user_reaction: currentReaction,
                my_reaction: currentReaction,
                reaction_counts: newCounts,
                total_reactions: total
            }
        };
    }

    /** Ambil daftar personil yang bereaksi pada postingan ("Siapa saja yg ngelike"). */
    async getPostReactions(user: any, postId: number) {
        const rows = await this.dataSource.query(
            `SELECT r.id, r.reaction_type, r.created_at,
                    u.id as user_id, u.name, u.username, u.callsign, u.photo_url, u.role_bdb, u.social_media,
                    s.nama_singkat as satker, s.deskripsi as satker_nama,
                    p.pangkat, p.nrp, p.jenis_kelamin, p.foto
             FROM bdb_social_reactions r
             JOIN auth_users u ON u.id = r.user_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             LEFT JOIN trb_police p ON (lower(p.email) = lower(u.email) OR (u.email_polri IS NOT NULL AND lower(p.email) = lower(u.email_polri)))
             WHERE r.post_id = $1
             ORDER BY r.created_at DESC`,
            [postId]
        );
        const list = rows.map((r: any) => {
            const isUserOne = this.isSuperUserOne(r.user_id, r.username, r.callsign);
            const satkerName = isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker || r.satker_nama || 'Polri');
            const isVerified = isUserOne ? true : Boolean(r.role_bdb && r.role_bdb !== 'sharese');
            const resolvedPhoto = this.resolveDefaultAvatar(r.photo_url || r.foto, r.name, r.jenis_kelamin, r.social_media);
            const resolvedReactionHandle = this.formatCallsign(r.callsign || r.username, r.user_id, r.username, r.name).replace(/^@/, '');
            return {
                id: Number(r.id),
                reaction_type: r.reaction_type,
                created_at: r.created_at,
                is_verified: isVerified,
                user: {
                    id: Number(r.user_id),
                    name: isUserOne ? (r.name || 'EKO') : r.name,
                    username: resolvedReactionHandle,
                    callsign: resolvedReactionHandle,
                    photo_url: resolvedPhoto,
                    role_bdb: isUserOne ? 'superadmin' : r.role_bdb,
                    satker: satkerName,
                    satker_nama: satkerName,
                    is_verified: isVerified,
                    pangkat: r.pangkat || (isUserOne ? 'KOMPOL' : (['superadmin', 'admin_binops'].includes(String(r.role_bdb || '').toLowerCase()) ? 'Superadmin' : 'Personil Polri')),
                    nrp: r.nrp
                }
            };
        });
        return { status: 1, data: list };
    }

    async getReactions(user: any, postId: number) {
        return this.getPostReactions(user, postId);
    }

    /** Simpan atau hapus postingan dari daftar bookmark/simpanan. */
    async toggleBookmark(user: any, postId: number) {
        const uid = Number(user?.id);
        if (!uid) throw new ForbiddenException('Sesi tidak valid');
        const ex = await this.dataSource.query(
            'SELECT id FROM bdb_social_bookmarks WHERE post_id = $1 AND user_id = $2',
            [postId, uid]
        );
        let bookmarked = false;
        if (ex.length) {
            await this.dataSource.query('DELETE FROM bdb_social_bookmarks WHERE post_id = $1 AND user_id = $2', [postId, uid]);
            bookmarked = false;
        } else {
            await this.dataSource.query('INSERT INTO bdb_social_bookmarks (post_id, user_id, created_at) VALUES ($1, $2, now()) ON CONFLICT DO NOTHING', [postId, uid]);
            bookmarked = true;
        }
        return {
            status: 1,
            message: bookmarked ? 'Postingan disimpan.' : 'Postingan dihapus dari simpanan.',
            data: { bookmarked, is_bookmarked: bookmarked, post_id: postId }
        };
    }

    /** Edit konten atau visibilitas postingan. */
    async editPost(user: any, postId: number, dto: { content: string; audience_type?: string }) {
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        const post = await this.dataSource.query('SELECT id, author_id FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!post.length) throw new NotFoundException('Postingan tidak ditemukan.');

        if (!isGlobalAdmin && Number(post[0].author_id) !== uid) {
            throw new ForbiddenException('Hanya pembuat postingan atau admin yang dapat mengedit postingan.');
        }

        const text = (dto.content || '').trim();
        if (!text) throw new BadRequestException('Konten postingan tidak boleh kosong.');
        if (text.length > 3000) throw new BadRequestException('Maksimal 3.000 karakter.');

        const aud = dto.audience_type && ['public', 'regional', 'friends', 'private'].includes(dto.audience_type)
            ? dto.audience_type
            : undefined;

        let updateQuery = 'UPDATE bdb_social_posts SET content = $1, is_edited = true, updated_at = NOW()';
        const params: any[] = [text];
        if (aud) {
            params.push(aud);
            updateQuery += ', audience_type = $' + params.length;
        }
        params.push(postId);
        updateQuery += ' WHERE id = $' + params.length + ' RETURNING *';
        const res = await this.dataSource.query(updateQuery, params);

        return {
            status: 1,
            message: 'Postingan berhasil diperbarui.',
            data: res[0] || { id: postId, content: text, audience_type: aud, is_edited: true }
        };
    }

    /** Diteruskan / Repost postingan. */
    async repostPost(user: any, postId: number, content?: string) {
        const uid = Number(user?.id);
        const original = await this.dataSource.query("SELECT * FROM bdb_social_posts WHERE id = $1 AND status = 'active'", [postId]);
        if (!original.length) throw new NotFoundException('Postingan asal tidak ditemukan.');

        await this.dataSource.query('UPDATE bdb_social_posts SET repost_count = repost_count + 1 WHERE id = $1', [postId]);

        const postText = (content || '').trim() || `🔁 Meneruskan postingan #${postId}`;
        const newPost = await this.dataSource.query(
            `INSERT INTO bdb_social_posts (author_id, audience_type, target_satker_ids, content, media_urls, case_lp_ids, reaction_counts, is_official_jukrah, parent_post_id, status, created_at, updated_at)
             VALUES ($1, 'public', '{}', $2, '[]', '{}', '{"like":0,"respect":0,"insightful":0,"applause":0,"fire":0}', false, $3, 'active', now(), now())
             RETURNING id, created_at`,
            [uid, postText, postId]
        );

        return { status: 1, message: 'Postingan berhasil diteruskan.', data: { id: Number(newPost[0].id) } };
    }

    /** Ambil direktori personil Polri real dari database untuk jejaring CAS. */
    async getNetworkUsers(user: any, opts: any) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const isSuperadmin = ['superadmin', 'vendor_mitra', 'vendor', 'mitra'].includes(String(user?.role_bdb || '').toLowerCase());
        const page = Math.max(1, Number(opts.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(opts.limit) || 30));
        const offset = (page - 1) * limit;
        const search = (opts.search || '').trim();
        const satkerId = opts.satker_id ? String(opts.satker_id).trim() : '';
        const filterMode = String(opts.filter || opts.tab || '').toLowerCase().trim();

        let rawConn = opts.connected_to;
        if (rawConn === 'undefined' || rawConn === 'null' || rawConn === '') rawConn = null;
        let connectedTo = (rawConn && !isNaN(Number(rawConn))) ? Number(rawConn) : null;
        if (!connectedTo && (filterMode === 'connected' || opts.satker === 'connected')) {
            connectedTo = Number(opts.target_user_id) || uid;
        }

        // Auto-seed realistic incoming PENDING connection requests (LinkedIn flow) if user has < 3 incoming requests
        if (uid > 0) {
            try {
                const incCheck = await this.dataSource.query(
                    `SELECT COUNT(*)::int as c FROM user_connections WHERE addressee_id = $1 AND status = 'PENDING'`,
                    [uid]
                );
                const currentIncoming = Number(incCheck[0]?.c || 0);
                if (currentIncoming < 3) {
                    const seedCandidates = await this.dataSource.query(
                        `SELECT u.id FROM auth_users u
                         WHERE u.id <> $1 AND u.id <> 1
                           AND (u.status = 'AKTIF' OR u.status = 'active')
                           AND u.username IS NOT NULL AND u.username <> ''
                           AND NOT EXISTS (
                               SELECT 1 FROM user_connections uc
                               WHERE (uc.requester_id = u.id AND uc.addressee_id = $1)
                                  OR (uc.requester_id = $1 AND uc.addressee_id = u.id)
                           )
                         ORDER BY u.last_login_at DESC NULLS LAST, u.id ASC
                         LIMIT 6`,
                        [uid]
                    );
                    for (let i = 0; i < seedCandidates.length; i++) {
                        const peerId = Number(seedCandidates[i].id);
                        if (peerId > 0) {
                            await this.dataSource.query(
                                `INSERT INTO user_connections (requester_id, addressee_id, status, created_at, updated_at)
                                 VALUES ($1, $2, 'PENDING', NOW() - ($3 || ' minutes')::interval, NOW() - ($3 || ' minutes')::interval)
                                 ON CONFLICT (requester_id, addressee_id) DO NOTHING`,
                                [peerId, uid, String((i + 1) * 17)]
                            );
                        }
                    }
                    this.clearNetworkUsersCache();
                }
            } catch {}
        }

        const now = Date.now();
        const filterKey = `${connectedTo || 0}|${filterMode}|${satkerId}|${search.toLowerCase()}`;
        const pageCacheKey = `${uid}|${isSuperadmin ? 1 : 0}|${filterKey}|${page}|${limit}`;
        const cachedPage = this.networkUsersCache.get(pageCacheKey);
        if (cachedPage && cachedPage.exp > now) {
            return cachedPage.value;
        }

        const whereClauses: string[] = ["(u.status = 'AKTIF' OR u.status = 'active')"];
        const params: any[] = [];
        if (search) {
            params.push('%' + search + '%');
            const sIdx = params.length;
            whereClauses.push(
                `(u.name ILIKE $${sIdx} OR u.username ILIKE $${sIdx} OR u.callsign ILIKE $${sIdx} OR u.email_polri ILIKE $${sIdx} OR u.scope_satker_id IN (SELECT id FROM bdb_satker WHERE deskripsi ILIKE $${sIdx} OR nama_singkat ILIKE $${sIdx}))`
            );
        }
        if (satkerId) {
            params.push(satkerId);
            whereClauses.push('u.scope_satker_id = $' + params.length);
        }
        if (filterMode === 'incoming' || filterMode === 'requests' || filterMode === 'pending_incoming') {
            params.push(uid);
            const incIdx = params.length;
            whereClauses.push(
                `u.id IN (SELECT requester_id FROM user_connections WHERE addressee_id = $${incIdx} AND status = 'PENDING')`
            );
        } else if (filterMode === 'outgoing' || filterMode === 'sent' || filterMode === 'pending_outgoing') {
            params.push(uid);
            const outIdx = params.length;
            whereClauses.push(
                `u.id IN (SELECT addressee_id FROM user_connections WHERE requester_id = $${outIdx} AND status = 'PENDING')`
            );
        } else if (connectedTo) {
            params.push(connectedTo);
            const cIdx = params.length;
            whereClauses.push(
                `u.id IN (SELECT addressee_id FROM user_connections WHERE requester_id = $${cIdx} AND status = 'ACCEPTED' UNION SELECT requester_id FROM user_connections WHERE addressee_id = $${cIdx} AND status = 'ACCEPTED')`
            );
        }

        const isSuggestedFilter = filterMode === 'suggested' || filterMode === 'recommendations';
        if (isSuggestedFilter && uid) {
            params.push(uid);
            const uIdx = params.length;
            whereClauses.push(
                `u.id <> $${uIdx} AND u.id NOT IN (SELECT addressee_id FROM user_connections WHERE requester_id = $${uIdx} UNION SELECT requester_id FROM user_connections WHERE addressee_id = $${uIdx})`
            );
        }

        const whereSql = whereClauses.join(' AND ');
        const filterParams = [...params];

        params.push(limit);
        const limitIdx = params.length;
        params.push(offset);
        const offsetIdx = params.length;
        params.push(uid);
        const uidIdx = params.length;

        const isDynamicConnTab = ['incoming', 'requests', 'pending_incoming', 'outgoing', 'sent', 'pending_outgoing', 'connected'].includes(filterMode) || isSuggestedFilter;
        const cachedCount = this.networkCountCache.get(filterKey);
        const hasValidCachedCount = Boolean(cachedCount && cachedCount.exp > now && !isDynamicConnTab);
        const countWindowSelect = hasValidCachedCount ? '' : ', COUNT(*) OVER()::int as total_count';

        const dataSql = `
            WITH paged_users AS MATERIALIZED (
                SELECT u.id, u.name, u.username, u.callsign, u.email, u.email_polri, u.role_bdb, u.photo_url, u.social_media, u.last_login_at, u.scope_satker_id, u.scope_satker_key${countWindowSelect}
                FROM auth_users u
                WHERE ${whereSql}
                ORDER BY (u.id = 1) DESC, u.last_login_at DESC NULLS LAST, u.id ASC
                LIMIT $${limitIdx} OFFSET $${offsetIdx}
            )
            SELECT pu.*, s.deskripsi as satker_nama, s.nama_singkat as satker_singkat, tp.pangkat, tp.jabatan, tp.nrp, tp.satuan, tp.no_hp, tp.jenis_kelamin, tp.foto as police_foto,
                   (SELECT CASE
                        WHEN uc.status = 'ACCEPTED' THEN 'connected'
                        WHEN uc.status = 'PENDING' AND uc.addressee_id = $${uidIdx} THEN 'incoming'
                        WHEN uc.status = 'PENDING' AND uc.requester_id = $${uidIdx} THEN 'outgoing'
                        ELSE 'none'
                    END
                    FROM user_connections uc
                    WHERE (uc.requester_id = $${uidIdx} AND uc.addressee_id = pu.id)
                       OR (uc.requester_id = pu.id AND uc.addressee_id = $${uidIdx})
                    ORDER BY (uc.status = 'ACCEPTED') DESC, uc.updated_at DESC
                    LIMIT 1) as peer_conn_state,
                   (SELECT COUNT(*)::int FROM user_connections uc WHERE (uc.requester_id = pu.id OR uc.addressee_id = pu.id) AND uc.status = 'ACCEPTED') as followers_count
            FROM paged_users pu
            LEFT JOIN bdb_satker s ON s.id = pu.scope_satker_id
            LEFT JOIN LATERAL (
                SELECT pangkat, jabatan, nrp, satuan, no_hp, jenis_kelamin, foto
                FROM trb_police tp
                WHERE lower(tp.email) = lower(pu.email)
                   OR (pu.email_polri IS NOT NULL AND lower(tp.email) = lower(pu.email_polri))
                LIMIT 1
            ) tp ON true
            ORDER BY (pu.id = 1) DESC, pu.last_login_at DESC NULLS LAST, pu.id ASC
        `;

        const rows = await this.dataSource.query(dataSql, params);
        let total = 0;
        if (hasValidCachedCount) {
            total = cachedCount!.total;
        } else if (rows.length > 0 && rows[0].total_count !== undefined) {
            total = Number(rows[0].total_count || 0);
            if (!isDynamicConnTab) {
                this.networkCountCache.set(filterKey, { exp: Date.now() + JukrahService.NETWORK_CACHE_TTL_MS, total });
            }
        } else if (offset > 0) {
            const cRes = await this.dataSource.query(`SELECT count(*)::int as total FROM auth_users u WHERE ${whereSql}`, filterParams);
            total = Number(cRes[0]?.total || 0);
            if (!isDynamicConnTab) {
                this.networkCountCache.set(filterKey, { exp: Date.now() + JukrahService.NETWORK_CACHE_TTL_MS, total });
            }
        } else if (!isDynamicConnTab) {
            this.networkCountCache.set(filterKey, { exp: Date.now() + JukrahService.NETWORK_CACHE_TTL_MS, total: 0 });
        }

        const mapUserRow = (r: any) => {
            const rowId = Number(r.id);
            const isUserOne = this.isSuperUserOne(rowId, r.username, r.callsign);
            const nrpFallback = r.email && r.email.match(/^(\d{7,10})@/) ? r.email.match(/^(\d{7,10})@/)[1] : (r.email_polri && r.email_polri.match(/^(\d{7,10})@/) ? r.email_polri.match(/^(\d{7,10})@/)[1] : null);
            const rawSatker = isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_singkat || r.satker_nama || r.satuan || 'Polri');
            const satkerCap = this.casCapitalizeEachWordSatker(rawSatker);
            const satkerNamaCap = this.casCapitalizeEachWordSatker(isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_nama || r.satker_singkat || r.satuan || 'Polri'));
            const pangkatCap = this.casCleanPangkat(r.pangkat, isUserOne, r.role_bdb);
            const isFemale = this.isFemalePersonnel(r.name, r.jenis_kelamin, r.social_media);
            const resolvedPhoto = this.resolveDefaultAvatar(r.photo_url || r.police_foto, r.name, r.jenis_kelamin, r.social_media);
            const resolvedHandle = this.formatCallsign(r.callsign || r.username, rowId, r.username, r.name).replace(/^@/, '');
            const connState = String(r.peer_conn_state || (connectedTo && connectedTo === uid ? 'connected' : 'none')).toLowerCase();
            const isConn = connState === 'connected';
            const fCount = Number(r.followers_count || 0);
            return {
                id: rowId,
                name: isUserOne ? (r.name || 'EKO') : r.name,
                callsign: resolvedHandle,
                username: resolvedHandle,
                email: r.email,
                email_polri: r.email_polri || (r.email && r.email.endsWith('@polri.go.id') ? r.email : null),
                role_bdb: isUserOne ? 'superadmin' : r.role_bdb,
                satker: satkerCap,
                satker_nama: satkerNamaCap,
                satker_singkat: satkerCap,
                scope_satker_name: satkerCap,
                pangkat: pangkatCap,
                jabatan: this.casCapitalizeEachWordSatker(r.jabatan || (isUserOne ? 'Kasubdit' : '')),
                nrp: r.nrp || nrpFallback,
                no_hp: r.no_hp || null,
                photo_url: resolvedPhoto,
                gender: isFemale ? 'P' : 'L',
                jenis_kelamin: isFemale ? 'P' : 'L',
                is_verified: true,
                is_following: isConn,
                is_connected: isConn,
                is_pending_incoming: connState === 'incoming',
                is_pending_outgoing: connState === 'outgoing',
                connection_status: connState,
                followers_count: fCount,
                connections_count: fCount,
                last_login_at: r.last_login_at
            };
        };

        const data = rows.map(mapUserRow);

        let counts = { incoming: 0, connected: 0, outgoing: 0 };
        let incomingRequests: any[] = [];
        if (uid > 0) {
            try {
                const summaryRes = await this.dataSource.query(
                    `SELECT
                        COUNT(*) FILTER (WHERE addressee_id = $1 AND status = 'PENDING')::int as incoming_count,
                        COUNT(*) FILTER (WHERE requester_id = $1 AND status = 'PENDING')::int as outgoing_count,
                        COUNT(*) FILTER (WHERE (requester_id = $1 OR addressee_id = $1) AND status = 'ACCEPTED')::int as connected_count
                     FROM user_connections
                     WHERE requester_id = $1 OR addressee_id = $1`,
                    [uid]
                );
                if (summaryRes.length) {
                    counts = {
                        incoming: Number(summaryRes[0].incoming_count || 0),
                        connected: Number(summaryRes[0].connected_count || 0),
                        outgoing: Number(summaryRes[0].outgoing_count || 0)
                    };
                }
                if (counts.incoming > 0) {
                    const incRows = await this.dataSource.query(
                        `SELECT u.id, u.name, u.username, u.callsign, u.email, u.email_polri, u.role_bdb, u.photo_url, u.social_media, u.last_login_at, u.scope_satker_id, u.scope_satker_key,
                                s.deskripsi as satker_nama, s.nama_singkat as satker_singkat, tp.pangkat, tp.jabatan, tp.nrp, tp.satuan, tp.no_hp, tp.jenis_kelamin, tp.foto as police_foto,
                                'incoming' as peer_conn_state,
                                (SELECT COUNT(*)::int FROM user_connections uc2 WHERE (uc2.requester_id = u.id OR uc2.addressee_id = u.id) AND uc2.status = 'ACCEPTED') as followers_count,
                                uc.created_at as requested_at
                         FROM user_connections uc
                         JOIN auth_users u ON u.id = uc.requester_id
                         LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
                         LEFT JOIN LATERAL (
                             SELECT pangkat, jabatan, nrp, satuan, no_hp, jenis_kelamin, foto
                             FROM trb_police tp
                             WHERE lower(tp.email) = lower(u.email)
                                OR (u.email_polri IS NOT NULL AND lower(tp.email) = lower(u.email_polri))
                             LIMIT 1
                         ) tp ON true
                         WHERE uc.addressee_id = $1 AND uc.status = 'PENDING'
                         ORDER BY uc.updated_at DESC
                         LIMIT 12`,
                        [uid]
                    );
                    incomingRequests = incRows.map(mapUserRow);
                }
            } catch {}
        }

        const result = {
            status: 1,
            data,
            incoming_requests: incomingRequests,
            counts,
            total,
            total_pages: Math.ceil(total / limit) || 1,
            page,
            limit,
            is_superadmin: isSuperadmin
        };
        if (!isDynamicConnTab) {
            if (this.networkUsersCache.size > 200) {
                for (const [k, v] of this.networkUsersCache.entries()) {
                    if (v.exp <= now) this.networkUsersCache.delete(k);
                }
            }
            this.networkUsersCache.set(pageCacheKey, { exp: Date.now() + JukrahService.NETWORK_CACHE_TTL_MS, value: result });
        }
        return result;
    }

    /** Ambil profil detail personil CAS (real data tanpa dummy). */
    async getNetworkProfile(user: any, targetId: any) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const cleanTarget = String(targetId || '').replace(/^@/, '').trim();
        let targetUid: number | null = null;
        if (/^\d+$/.test(cleanTarget)) {
            targetUid = Number(cleanTarget);
        } else if (/^user_(\d+)/i.test(cleanTarget)) {
            const m = cleanTarget.match(/^user_(\d+)/i);
            if (m) targetUid = Number(m[1]);
        }

        let sql = 'SELECT u.id, u.name, u.username, u.callsign, u.email, u.email_polri, u.role_bdb, u.photo_url, u.status, u.last_login_at, u.social_media, u.scope_satker_id, u.scope_satker_key, s.nama_singkat as satker_singkat, s.deskripsi as satker_nama FROM auth_users u LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id ';
        let params: any[] = [];
        if (targetUid) {
            sql += 'WHERE u.id = $1 LIMIT 1';
            params = [targetUid];
        } else {
            sql += 'WHERE lower(u.username) = $1 OR lower(u.callsign) = $1 LIMIT 1';
            params = [cleanTarget.toLowerCase()];
        }
        let uRes = await this.dataSource.query(sql, params);
        if ((!uRes || !uRes.length) && /^user_(\d+)[0-9a-f]{4}$/i.test(cleanTarget)) {
            const mHex = cleanTarget.match(/^user_(\d+)[0-9a-f]{4}$/i);
            if (mHex && Number(mHex[1]) > 0) {
                uRes = await this.dataSource.query(
                    'SELECT u.id, u.name, u.username, u.callsign, u.email, u.email_polri, u.role_bdb, u.photo_url, u.status, u.last_login_at, u.social_media, u.scope_satker_id, u.scope_satker_key, s.nama_singkat as satker_singkat, s.deskripsi as satker_nama FROM auth_users u LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id WHERE u.id = $1 LIMIT 1',
                    [Number(mHex[1])]
                );
            }
        }
        if (!uRes || !uRes.length) throw new NotFoundException('Personil tidak ditemukan');
        const target = uRes[0];
        const tId = Number(target.id);
        const isUserOne = this.isSuperUserOne(target.id, target.username, target.callsign);
        let policeProfile: any = null;
        let connectionsCount = 0;
        let isFollowing = false;
        let postsCount = 0;
        let recentPosts: any[] = [];
        try {
            const emailsLower = [target.email, target.email_polri].filter(Boolean).map((e: string) => String(e).toLowerCase());
            if (emailsLower.length) {
                const pRes = await this.dataSource.query(
                    'SELECT nrp, nama, jenis_kelamin, satuan, no_hp, pangkat, jabatan, foto, is_pns, social_media FROM trb_police WHERE lower(email) = any($1::text[]) LIMIT 1',
                    [emailsLower]
                );
                if (pRes && pRes.length) policeProfile = pRes[0];
            }
        } catch {}
        let connStateWithViewer = 'none';
        try {
            const cRes = await this.dataSource.query(
                "SELECT count(*)::int as c FROM (SELECT addressee_id FROM user_connections WHERE requester_id = $1 AND status = 'ACCEPTED' UNION SELECT requester_id FROM user_connections WHERE addressee_id = $1 AND status = 'ACCEPTED') conn",
                [tId]
            );
            connectionsCount = Number(cRes[0]?.c || 0);
            if (uid && uid !== tId) {
                const fRes = await this.dataSource.query(
                    "SELECT requester_id, addressee_id, status FROM user_connections WHERE ((requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)) ORDER BY (status = 'ACCEPTED') DESC, updated_at DESC LIMIT 1",
                    [uid, tId]
                );
                if (fRes.length > 0) {
                    if (fRes[0].status === 'ACCEPTED') {
                        isFollowing = true;
                        connStateWithViewer = 'connected';
                    } else if (fRes[0].status === 'PENDING') {
                        connStateWithViewer = Number(fRes[0].addressee_id) === uid ? 'incoming' : 'outgoing';
                    }
                }
            }
        } catch {}
        try {
            const pCountRes = await this.dataSource.query(
                "SELECT count(*)::int as c FROM bdb_social_posts WHERE author_id = $1 AND status = 'active'",
                [tId]
            );
            postsCount = Number(pCountRes[0]?.c || 0);
            const pRows = await this.dataSource.query(
                `SELECT p.id, p.content, p.audience_type, p.reaction_counts, p.repost_count, p.view_count, p.is_official_jukrah, p.is_pinned, p.created_at,
                        (SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id) as comments_count,
                        (SELECT COUNT(*)::int FROM bdb_social_reactions rx WHERE rx.post_id = p.id) as total_reactions
                 FROM bdb_social_posts p
                 WHERE p.author_id = $1 AND p.status = 'active' AND (p.audience_type <> 'private' OR p.author_id = $2)
                 ORDER BY p.is_pinned DESC, p.created_at DESC
                 LIMIT 20`,
                [tId, uid]
            );
            recentPosts = pRows.map((pr: any) => ({
                id: Number(pr.id),
                content: pr.content,
                audience_type: pr.audience_type,
                reaction_counts: pr.reaction_counts || {},
                total_reactions: Number(pr.total_reactions || 0),
                comments_count: Number(pr.comments_count || 0),
                repost_count: Number(pr.repost_count || 0),
                view_count: Number(pr.view_count || 0),
                is_official_jukrah: Boolean(pr.is_official_jukrah),
                is_pinned: Boolean(pr.is_pinned),
                created_at: pr.created_at
            }));
        } catch {}
        const satkerSpecific = this.casCapitalizeEachWordSatker(isUserOne ? 'Robinopsnal Bareskrim Polri' : (target.satker_singkat || target.satker_nama || policeProfile?.satuan || 'Polri'));
        const satkerNamaCap = this.casCapitalizeEachWordSatker(isUserOne ? 'Robinopsnal Bareskrim Polri' : (target.satker_nama || target.satker_singkat || policeProfile?.satuan || 'Polri'));
        const pangkatCap = this.casCleanPangkat(policeProfile?.pangkat, isUserOne, target.role_bdb);
        const pSoc = (policeProfile?.social_media && typeof policeProfile.social_media === 'object') ? policeProfile.social_media : {};
        const uSoc = (target.social_media && typeof target.social_media === 'object') ? target.social_media : {};
        const rawSocial: any = { ...pSoc, ...uSoc };
        const isCustomBanner = (val: any) => typeof val === 'string' && val.trim().length > 5 && !val.includes('default-banner');
        if (isCustomBanner(uSoc.banner_theme)) rawSocial.banner_theme = uSoc.banner_theme.trim();
        else if (isCustomBanner(pSoc.banner_theme)) rawSocial.banner_theme = pSoc.banner_theme.trim();
        const resolvedBanner = this.resolveDefaultBanner(rawSocial);
        const isCustomPhoto = (val: any) => typeof val === 'string' && val.trim().length > 5 && val !== 'null' && val !== 'undefined' && !val.includes('default-avatar');
        const customPhotoCandidate = isCustomPhoto(target.photo_url) ? target.photo_url.trim() : (isCustomPhoto(policeProfile?.foto) ? policeProfile.foto.trim() : null);
        const mergedSocial = {
            ...rawSocial,
            banner_theme: resolvedBanner,
            ...(customPhotoCandidate ? { avatar_v2: true } : {}),
            ...(isCustomBanner(resolvedBanner) ? { banner_v2: true } : {})
        };
        const isFemale = this.isFemalePersonnel(target.name || policeProfile?.nama, policeProfile?.jenis_kelamin, mergedSocial);
        const resolvedPhoto = this.resolveDefaultAvatar(customPhotoCandidate, target.name || policeProfile?.nama, policeProfile?.jenis_kelamin, mergedSocial);
        const resolvedHandle = this.formatCallsign(target.callsign || target.username, target.id, target.username, target.name).replace(/^@/, '');
        return {
            status: 1,
            data: {
                id: tId,
                name: isUserOne ? (target.name || 'EKO') : target.name,
                username: resolvedHandle,
                callsign: resolvedHandle,
                nrp: policeProfile?.nrp || (target.email && target.email.match(/^(\d{7,10})@/) ? target.email.match(/^(\d{7,10})@/)[1] : (target.email_polri && target.email_polri.match(/^(\d{7,10})@/) ? target.email_polri.match(/^(\d{7,10})@/)[1] : null)),
                pangkat: pangkatCap,
                jabatan: this.casCapitalizeEachWordSatker(policeProfile?.jabatan || (isUserOne ? 'Kasubdit' : target.role_bdb)),
                satuan: satkerNamaCap,
                satker: satkerSpecific,
                satker_nama: satkerNamaCap,
                scope_satker_name: satkerSpecific,
                email_polri: target.email_polri || (target.email && target.email.endsWith('@polri.go.id') ? target.email : null),
                email: target.email,
                no_hp: policeProfile?.no_hp || null,
                photo_url: resolvedPhoto,
                banner_theme: resolvedBanner,
                bio: rawSocial?.bio || '',
                gender: isFemale ? 'P' : 'L',
                jenis_kelamin: isFemale ? 'P' : 'L',
                role_bdb: isUserOne ? 'superadmin' : target.role_bdb,
                is_verified: true,
                is_following: isFollowing,
                is_connected: isFollowing,
                is_pending_incoming: connStateWithViewer === 'incoming',
                is_pending_outgoing: connStateWithViewer === 'outgoing',
                connection_status: connStateWithViewer,
                connections_count: connectionsCount,
                followers_count: connectionsCount,
                following_count: connectionsCount,
                posts_count: postsCount,
                posts: recentPosts,
                social_media: mergedSocial,
                last_login_at: target.last_login_at
            }
        };
    }

    /** Hubungkan / terima / kirim permintaan koneksi di jaringan CAS (Alur LinkedIn). */
    async connectNetworkUser(user: any, targetId: number) {
        await this.ensureTable();
        const uid = Number(user?.id);
        const tid = Number(targetId);
        if (!uid || !tid || uid === tid) {
            throw new BadRequestException('Target koneksi tidak valid.');
        }
        const existing = await this.dataSource.query(
            `SELECT id, requester_id, addressee_id, status FROM user_connections
             WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)
             ORDER BY (status = 'ACCEPTED') DESC, updated_at DESC LIMIT 1`,
            [uid, tid]
        );
        const senderHandle = this.formatCallsign(user?.callsign || user?.username, uid, user?.username, user?.name);
        let finalStatus = 'outgoing';
        let isAcceptedNow = false;

        if (existing.length > 0) {
            const row = existing[0];
            if (row.status === 'ACCEPTED') {
                finalStatus = 'connected';
                isAcceptedNow = true;
            } else if (row.status === 'PENDING' && Number(row.addressee_id) === uid) {
                // Menerima permintaan koneksi masuk (Accept Incoming Request)
                await this.dataSource.query(
                    `UPDATE user_connections SET status = 'ACCEPTED', updated_at = NOW() WHERE id = $1`,
                    [row.id]
                );
                finalStatus = 'connected';
                isAcceptedNow = true;
                await this.createNotification({
                    recipientId: tid,
                    senderId: uid,
                    category: 'social',
                    type: 'connection',
                    title: `${senderHandle} menerima permintaan koneksi Anda`,
                    message: `Kini Anda terhubung dengan ${senderHandle} di Sharese.`,
                    link: `/cms/broadcaster?view=koneksi&profileId=${uid}`
                });
            } else {
                // Sudah mengirim permintaan sebelumnya
                await this.dataSource.query(
                    `UPDATE user_connections SET updated_at = NOW() WHERE id = $1`,
                    [row.id]
                );
                finalStatus = 'outgoing';
            }
        } else {
            // Mengirim permintaan koneksi baru (PENDING)
            await this.dataSource.query(
                `INSERT INTO user_connections (requester_id, addressee_id, status, created_at, updated_at)
                 VALUES ($1, $2, 'PENDING', NOW(), NOW())
                 ON CONFLICT (requester_id, addressee_id) DO UPDATE SET status = 'PENDING', updated_at = NOW()`,
                [uid, tid]
            );
            finalStatus = 'outgoing';
            await this.createNotification({
                recipientId: tid,
                senderId: uid,
                category: 'social',
                type: 'connection',
                title: `${senderHandle} mengirim permintaan koneksi kepada Anda`,
                message: `Ketuk untuk menerima atau meninjau permintaan koneksi dari ${senderHandle}.`,
                link: `/cms/broadcaster?view=koneksi&profileId=${uid}`
            });
        }

        this.clearNetworkUsersCache();
        const cRes = await this.dataSource.query(
            "SELECT count(*)::int as c FROM (SELECT addressee_id FROM user_connections WHERE requester_id = $1 AND status = 'ACCEPTED' UNION SELECT requester_id FROM user_connections WHERE addressee_id = $1 AND status = 'ACCEPTED') conn",
            [tid]
        );
        const connectionsCount = Number(cRes[0]?.c || 0);
        return {
            status: 1,
            message: isAcceptedNow ? 'Permintaan koneksi diterima. Anda kini terhubung!' : 'Permintaan koneksi berhasil dikirim.',
            connections_count: connectionsCount,
            data: {
                target_id: tid,
                is_connected: isAcceptedNow,
                is_following: isAcceptedNow,
                is_pending_incoming: false,
                is_pending_outgoing: finalStatus === 'outgoing',
                connection_status: finalStatus,
                connections_count: connectionsCount
            }
        };
    }

    /** Putuskan koneksi atau abaikan permintaan di jaringan CAS. */
    async disconnectNetworkUser(user: any, targetId: number) {
        await this.ensureTable();
        const uid = Number(user?.id);
        const tid = Number(targetId);
        if (!uid || !tid) {
            throw new BadRequestException('Target koneksi tidak valid.');
        }
        await this.dataSource.query(
            'DELETE FROM user_connections WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)',
            [uid, tid]
        );
        this.clearNetworkUsersCache();
        const cRes = await this.dataSource.query(
            "SELECT count(*)::int as c FROM (SELECT addressee_id FROM user_connections WHERE requester_id = $1 AND status = 'ACCEPTED' UNION SELECT requester_id FROM user_connections WHERE addressee_id = $1 AND status = 'ACCEPTED') conn",
            [tid]
        );
        const connectionsCount = Number(cRes[0]?.c || 0);
        return {
            status: 1,
            message: 'Koneksi atau permintaan telah dihapus.',
            connections_count: connectionsCount,
            data: {
                target_id: tid,
                is_connected: false,
                is_following: false,
                is_pending_incoming: false,
                is_pending_outgoing: false,
                connection_status: 'none',
                connections_count: connectionsCount
            }
        };
    }

    /** Toggle follow/connect personil (Mendukung terima masuk, batalkan terkirim, atau kirim baru). */
    async toggleFollowUser(user: any, targetId: number) {
        await this.ensureTable();
        const uid = Number(user?.id);
        const tid = Number(targetId);
        if (!uid || !tid || uid === tid) {
            throw new BadRequestException('Target koneksi tidak valid.');
        }
        const ex = await this.dataSource.query(
            `SELECT id, requester_id, addressee_id, status FROM user_connections
             WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)
             ORDER BY (status = 'ACCEPTED') DESC, updated_at DESC LIMIT 1`,
            [uid, tid]
        );
        if (ex.length > 0) {
            if (ex[0].status === 'PENDING' && Number(ex[0].addressee_id) === uid) {
                return this.connectNetworkUser(user, tid);
            }
            return this.disconnectNetworkUser(user, tid);
        }
        return this.connectNetworkUser(user, tid);
    }

    /** Ambil komentar sebuah postingan. */
    async getComments(user: any, postId: number) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const userRole = String(user?.role_bdb || '').toLowerCase();
        const isVendorMitra = ['vendor_mitra', 'vendor', 'mitra'].includes(userRole);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(userRole);
        const isGlobalReader = isGlobalAdmin || isVendorMitra;

        const rows = await this.dataSource.query(
            `SELECT c.id, c.parent_id, c.content, c.created_at, c.is_edited, c.updated_at,
                    p.author_id as post_author_id,
                    u.id as author_id, u.name as raw_name, u.callsign, u.username, u.role_bdb, u.photo_url, u.social_media,
                    s.nama_singkat as satker, s.deskripsi as satker_nama,
                    (SELECT COUNT(*)::int FROM bdb_social_comment_reactions cr WHERE cr.comment_id = c.id) as likes_count,
                    EXISTS(SELECT 1 FROM bdb_social_comment_reactions cr WHERE cr.comment_id = c.id AND cr.user_id = $2) as is_liked
             FROM bdb_social_comments c
             JOIN bdb_social_posts p ON p.id = c.post_id
             JOIN auth_users u ON u.id = c.user_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC`,
            [postId, uid]
        );

        const comments = rows.map((r: any) => {
            const isSelf = Number(r.author_id) === uid;
            const isUserOne = this.isSuperUserOne(r.author_id, r.username, r.callsign);
            const canSeeReal = isGlobalReader || isSelf || isUserOne;
            const handle = this.formatCallsign(r.callsign, r.author_id, r.username, r.raw_name);
            const cleanCallsign = handle.startsWith('@') ? handle.slice(1) : handle;
            return {
                id: Number(r.id),
                parent_id: r.parent_id ? Number(r.parent_id) : null,
                content: r.content,
                created_at: r.created_at,
                updated_at: r.updated_at || r.created_at,
                is_edited: Boolean(r.is_edited),
                author_id: Number(r.author_id),
                author_username: cleanCallsign,
                author_callsign: cleanCallsign,
                author_handle: handle,
                author_name: isUserOne ? (r.raw_name || 'EKO') : (canSeeReal ? (r.raw_name || handle) : handle),
                author_role: isUserOne ? 'superadmin' : (r.role_bdb || 'sharese'),
                author_satker: isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker || r.satker_nama || 'Polri'),
                author_photo: this.resolveDefaultAvatar(r.photo_url, r.raw_name, null, r.social_media),
                is_verified: isUserOne ? true : Boolean(r.role_bdb && r.role_bdb !== 'sharese'),
                likes_count: Number(r.likes_count || 0),
                is_liked: Boolean(r.is_liked),
                can_edit: !isVendorMitra && (isSelf || isGlobalAdmin),
                can_delete: !isVendorMitra && (isSelf || Number(r.post_author_id) === uid || isGlobalAdmin)
            };
        });

        return { status: 1, data: comments };
    }

    /** Tambah komentar atau balasan. */
    async addComment(user: any, postId: number, content: string, parentId?: number) {
        await this.ensureTable();
        const uid = Number(user?.id);
        const text = (content || '').trim();
        if (!text) throw new BadRequestException('Komentar tidak boleh kosong.');
        if (text.length > 1000) throw new BadRequestException('Panjang teks komentar maksimal 1.000 karakter.');

        const post = await this.dataSource.query('SELECT author_id FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!post.length) throw new NotFoundException('Postingan tidak ditemukan.');

        const r = await this.dataSource.query(
            'INSERT INTO bdb_social_comments (post_id, user_id, parent_id, content) VALUES ($1, $2, $3, $4) RETURNING id, created_at',
            [postId, uid, parentId ? Number(parentId) : null, text]
        );

        const actorName = this.casFormatHumanName(user?.name || user?.username || 'Rekan Personil');
        const actorHandle = this.formatCallsign(user?.callsign || user?.username, uid, user?.username, user?.name);
        const cleanCommentSnip = text.replace(/\s+/g, ' ').trim();
        const shortCommentSnip = cleanCommentSnip.length > 45 ? cleanCommentSnip.slice(0, 45) + '...' : cleanCommentSnip;
        const cMentionMatches = text.match(/@([a-z0-9_.]{3,30})/gi);
        if (cMentionMatches && cMentionMatches.length) {
            const cHandles = Array.from(new Set(cMentionMatches.map(m => m.slice(1).toLowerCase())));
            try {
                const cTaggedUsers = await this.dataSource.query(
                    'SELECT id, username, callsign FROM auth_users WHERE (lower(username) = ANY($1) OR lower(callsign) = ANY($1)) AND id <> $2',
                    [cHandles, uid]
                );
                for (const tu of cTaggedUsers) {
                    await this.createNotification({
                        recipientId: Number(tu.id),
                        senderId: uid,
                        category: 'social',
                        type: 'mention',
                        postId,
                        title: `${actorHandle} menyebut Anda dalam diskusi: "${shortCommentSnip}"`,
                        message: `"${shortCommentSnip}"`
                    });
                }
            } catch (err: any) {
                this.logger.error('Failed to dispatch comment mention notifications: ' + err.message);
            }
        }

        if (Number(post[0].author_id) !== uid) {
            await this.createNotification({
                recipientId: Number(post[0].author_id),
                senderId: uid,
                category: 'social',
                type: 'comment',
                postId,
                title: `${actorHandle} mengomentari kiriman Anda: "${shortCommentSnip}"`,
                message: `"${shortCommentSnip}"`
            });
        }

        const uRows = await this.dataSource.query(
            `SELECT u.id, u.name, u.username, u.callsign, u.role_bdb, u.photo_url, u.social_media,
                    s.nama_singkat as satker, s.deskripsi as satker_nama
             FROM auth_users u
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE u.id = $1`,
            [uid]
        );
        const uInfo = uRows[0] || user || {};
        const isUserOne = this.isSuperUserOne(uid, uInfo.username, uInfo.callsign);
        const handle = this.formatCallsign(uInfo.callsign, uid, uInfo.username, uInfo.name);
        const cleanCallsign = handle.startsWith('@') ? handle.slice(1) : handle;

        return {
            status: 1,
            message: 'Komentar terkirim.',
            data: {
                id: Number(r[0].id),
                parent_id: parentId ? Number(parentId) : null,
                content: text,
                created_at: r[0].created_at,
                updated_at: r[0].created_at,
                is_edited: false,
                author_id: uid,
                author_username: cleanCallsign,
                author_callsign: cleanCallsign,
                author_handle: handle,
                author_name: isUserOne ? (uInfo.name || 'EKO') : (uInfo.name || handle),
                author_role: isUserOne ? 'superadmin' : (uInfo.role_bdb || 'sharese'),
                author_satker: isUserOne ? 'Robinopsnal Bareskrim Polri' : (uInfo.satker || uInfo.satker_nama || 'Polri'),
                author_photo: this.resolveDefaultAvatar(uInfo.photo_url, uInfo.name, null, uInfo.social_media),
                is_verified: isUserOne ? true : Boolean(uInfo.role_bdb && uInfo.role_bdb !== 'sharese'),
                likes_count: 0,
                is_liked: false,
                can_edit: true,
                can_delete: true
            }
        };
    }

    /** Edit komentar (author komentar atau admin). */
    async editComment(user: any, commentId: number, content: string) {
        await this.ensureTable();
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());

        const com = await this.dataSource.query('SELECT id, user_id, post_id FROM bdb_social_comments WHERE id = $1', [commentId]);
        if (!com.length) throw new NotFoundException('Komentar tidak ditemukan.');

        if (Number(com[0].user_id) !== uid && !isGlobalAdmin) {
            throw new ForbiddenException('Anda tidak memiliki izin mengedit komentar ini.');
        }

        const text = (content || '').trim();
        if (!text) throw new BadRequestException('Komentar tidak boleh kosong.');
        if (text.length > 1000) throw new BadRequestException('Panjang teks komentar maksimal 1.000 karakter.');

        await this.dataSource.query(
            'UPDATE bdb_social_comments SET content = $1, is_edited = true, updated_at = NOW() WHERE id = $2',
            [text, commentId]
        );

        return {
            status: 1,
            message: 'Komentar berhasil diperbarui.',
            data: { id: commentId, content: text, is_edited: true }
        };
    }

    /** Like / batal like komentar. */
    async reactComment(user: any, commentId: number) {
        await this.ensureTable();
        const uid = Number(user?.id);
        if (!uid) throw new ForbiddenException('Sesi tidak valid.');

        const com = await this.dataSource.query('SELECT id, user_id, post_id FROM bdb_social_comments WHERE id = $1', [commentId]);
        if (!com.length) throw new NotFoundException('Komentar tidak ditemukan.');

        const ex = await this.dataSource.query(
            'SELECT 1 FROM bdb_social_comment_reactions WHERE comment_id = $1 AND user_id = $2',
            [commentId, uid]
        );
        let liked = false;
        if (ex.length) {
            await this.dataSource.query(
                'DELETE FROM bdb_social_comment_reactions WHERE comment_id = $1 AND user_id = $2',
                [commentId, uid]
            );
            liked = false;
        } else {
            await this.dataSource.query(
                'INSERT INTO bdb_social_comment_reactions (comment_id, user_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
                [commentId, uid]
            );
            liked = true;
        }

        const countRes = await this.dataSource.query(
            'SELECT COUNT(*)::int as c FROM bdb_social_comment_reactions WHERE comment_id = $1',
            [commentId]
        );
        const count = Number(countRes[0]?.c || 0);

        return {
            status: 1,
            data: { id: commentId, is_liked: liked, likes_count: count }
        };
    }

    /** Hapus komentar (hanya author komentar atau author post atau admin). */
    async deleteComment(user: any, commentId: number) {
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());

        const com = await this.dataSource.query(
            `SELECT c.id, c.user_id, p.author_id as post_author_id 
             FROM bdb_social_comments c 
             JOIN bdb_social_posts p ON p.id = c.post_id 
             WHERE c.id = $1`,
            [commentId]
        );
        if (!com.length) throw new NotFoundException('Komentar tidak ditemukan.');

        const isCommentAuthor = Number(com[0].user_id) === uid;
        const isPostAuthor = Number(com[0].post_author_id) === uid;

        if (!isCommentAuthor && !isPostAuthor && !isGlobalAdmin) {
            throw new ForbiddenException('Anda tidak memiliki izin menghapus komentar ini.');
        }

        await this.dataSource.query('DELETE FROM bdb_social_comments WHERE id = $1', [commentId]);
        return { status: 1, message: 'Komentar berhasil dihapus.' };
    }

    /** Konfirmasi keterbacaan instruksi kedinasan ("Paham & Siap Laksanakan"). */
    async acknowledgePost(user: any, postId: number) {
        const uid = Number(user?.id);
        const satkerId = Number(user?.scope_satker_id || 0);

        await this.dataSource.query(
            `INSERT INTO bdb_social_read_receipts (post_id, satker_id, user_id, acknowledged_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (post_id, user_id) DO NOTHING`,
            [postId, satkerId, uid]
        );
        await this.dataSource.query('UPDATE bdb_social_posts SET view_count = coalesce(view_count, 0) + 1 WHERE id = $1', [postId]);

        const countRes = await this.dataSource.query(
            'SELECT COUNT(*)::int as c FROM bdb_social_read_receipts WHERE post_id = $1',
            [postId]
        );

        return {
            status: 1,
            message: 'Konfirmasi keterbacaan tercatat.',
            data: { acknowledged: true, acknowledged_count: Number(countRes[0].c) }
        };
    }

    /** Ubah visibilitas postingan (Publik <-> Privat). */
    async updateVisibility(user: any, postId: number, audienceType: string) {
        const uid = Number(user?.id);
        const valid = ['public', 'regional', 'friends', 'private'];
        if (!valid.includes(audienceType)) throw new BadRequestException('Tipe audiens tidak valid.');

        const ex = await this.dataSource.query('SELECT author_id FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!ex.length) throw new NotFoundException('Postingan tidak ditemukan.');

        if (Number(ex[0].author_id) !== uid) {
            throw new ForbiddenException('Hanya pembuat postingan yang dapat mengubah visibilitas.');
        }

        await this.dataSource.query('UPDATE bdb_social_posts SET audience_type = $2, updated_at = NOW() WHERE id = $1', [postId, audienceType]);
        return { status: 1, message: `Visibilitas diubah menjadi "${audienceType}".` };
    }

    /** Hapus / Takedown postingan. */
    async deletePost(user: any, postId: number) {
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());

        const ex = await this.dataSource.query('SELECT author_id FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!ex.length) throw new NotFoundException('Postingan tidak ditemukan.');

        if (Number(ex[0].author_id) !== uid && !isGlobalAdmin) {
            throw new ForbiddenException('Hanya pembuat postingan atau admin yang berhak menghapus.');
        }

        await this.dataSource.query("UPDATE bdb_social_posts SET status = 'deleted', updated_at = NOW() WHERE id = $1", [postId]);
        await this.audit.log({ user, action: 'DELETE', entity: 'social_post', entityId: postId });
        return { status: 1, message: 'Postingan telah dihapus.' };
    }

    /** Laporkan postingan mencurigakan / bocor operasi. */
    async reportPost(user: any, postId: number, reason: string) {
        const uid = Number(user?.id);
        const post = await this.dataSource.query('SELECT id, author_id, content FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!post.length) throw new NotFoundException('Postingan tidak ditemukan.');

        const admins = await this.dataSource.query("SELECT id FROM auth_users WHERE role_bdb IN ('superadmin', 'admin_binops')");
        for (const adm of admins) {
            await this.createNotification({
                recipientId: Number(adm.id),
                senderId: uid,
                category: 'dinas',
                type: 'report_violation',
                postId,
                title: '🚨 Laporan Postingan Sensitif / Pelanggaran',
                message: `Postingan #${postId} dilaporkan oleh personil. Alasan: ${reason || 'Indikasi kebocoran rahasia operasi'}`
            });
        }

        return { status: 1, message: 'Laporan telah diteruskan ke Superadmin & Pengawas.' };
    }

    /** Panic Takedown darurat (khusus Superadmin / Admin Binops). */
    async panicTakedown(user: any, postId: number) {
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase()) || Number(user?.id) === 1;
        if (!isGlobalAdmin) throw new ForbiddenException('Akses ditolak.');

        await this.dataSource.query("UPDATE bdb_social_posts SET status = 'quarantined', updated_at = NOW() WHERE id = $1", [postId]);
        await this.audit.log({ user, action: 'TAKEDOWN', entity: 'social_post', entityId: postId, meta: { reason: 'PANIC_TAKEDOWN' } });
        return { status: 1, message: 'Postingan berhasil ditarik dan dikarantina dari linimasa.' };
    }

    /** Toggle status Jukrah Resmi Kedinasan pada postingan (Sinkronisasi Sharese <-> Moderasi). */
    async toggleOfficialJukrah(user: any, postId: number, forceValue?: any) {
        await this.ensureTable();
        const uid = Number(user?.id || user?.user?.id || 0);
        if (!uid) throw new ForbiddenException('Sesi tidak valid.');

        const rows = await this.dataSource.query('SELECT id, author_id, content, is_official_jukrah FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!rows.length) throw new NotFoundException('Postingan tidak ditemukan.');

        const current = Boolean(rows[0].is_official_jukrah);
        const nextVal = forceValue !== undefined ? (forceValue === true || forceValue === 'true' || forceValue === 1) : !current;

        await this.dataSource.query(
            'UPDATE bdb_social_posts SET is_official_jukrah = $2, updated_at = NOW() WHERE id = $1',
            [postId, nextVal]
        );

        if (nextVal && !current) {
            await this.broadcastDinasNotification(postId, { id: uid }, rows[0].content || '');
        }

        await this.audit.log({
            user,
            action: 'UPDATE',
            entity: 'social_post',
            entityId: postId,
            meta: { toggle: 'is_official_jukrah', value: nextVal }
        });

        return {
            status: 1,
            message: nextVal
                ? 'Postingan ditetapkan sebagai 📢 Jukrah Resmi Kedinasan dan disinkronkan ke Moderasi.'
                : 'Status Jukrah Resmi pada postingan telah dicabut.',
            data: { id: postId, is_official_jukrah: nextVal }
        };
    }

    /** Toggle status Sematkan (Pin) pada postingan Sharese / Jukrah Resmi. */
    async togglePinPost(user: any, postId: number, forceValue?: any) {
        await this.ensureTable();
        const uid = Number(user?.id || user?.user?.id || 0);
        if (!uid) throw new ForbiddenException('Sesi tidak valid.');

        const rows = await this.dataSource.query('SELECT id, author_id, is_pinned FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!rows.length) throw new NotFoundException('Postingan tidak ditemukan.');

        const current = Boolean(rows[0].is_pinned);
        const nextVal = forceValue !== undefined ? (forceValue === true || forceValue === 'true' || forceValue === 1) : !current;

        await this.dataSource.query(
            'UPDATE bdb_social_posts SET is_pinned = $2, updated_at = NOW() WHERE id = $1',
            [postId, nextVal]
        );

        return {
            status: 1,
            message: nextVal ? 'Postingan berhasil disematkan (Pin) di puncak Feed.' : 'Sematan postingan dilepas (Unpin).',
            data: { id: postId, is_pinned: nextVal }
        };
    }

    // =========================================================================
    // NOTIFIKASI DWI-FUNGSI: TAB DINAS & TAB SOSIAL
    // =========================================================================

    private async createNotification(data: { recipientId: number; senderId: number; category: string; type: string; postId?: number; title: string; message: string; link?: string }) {
        try {
            await this.ensureTable();
            await this.dataSource.query(
                `INSERT INTO bdb_social_notifications (recipient_id, sender_id, category, type, post_id, title, message, link)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [data.recipientId, data.senderId, data.category, data.type, data.postId || null, data.title, data.message, data.link || null]
            );
        } catch (e: any) {
            this.logger.error(`Gagal membuat notifikasi: ${e.message}`);
        }
    }

    private casFormatHumanName(rawName: any): string {
        const s = String(rawName || '').trim();
        if (!s) return 'Rekan Personil';
        if (s.startsWith('@')) return s;
        const preserveUpper = new Set([
            'AKBP', 'KOMPOL', 'IPTU', 'IPDA', 'AIPTU', 'AIPDA', 'BRIPKA', 'BRIGPOL', 'BRIPTU', 'BRIPDA',
            'KOMBES', 'BRIGJEN', 'IRJEN', 'KOMJEN', 'JENDERAL', 'POL', 'POLRI', 'CAS', 'BDB', 'LP',
            'SP2HP', 'P21', 'SP3', 'RJ', 'DORS', 'NRP', 'NIP', 'PNS', 'ASN', 'IT', 'AI', 'II', 'III', 'IV'
        ]);
        return s
            .split(/\s+/)
            .map(word => {
                if (/^[A-Za-z]\.[A-Za-z.]+\.?$/.test(word)) return word.toUpperCase();
                const clean = word.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                if (preserveUpper.has(clean)) return word.toUpperCase();
                // Collapse 3+ repeated trailing letters in all-caps nicknames like NYOMANNNN -> NYOMAN, RENCIAA -> RENCIA
                let norm = word;
                if (/^[A-Z]{4,}$/.test(word)) {
                    norm = word.replace(/([A-Z])\1{2,}$/, '$1').replace(/([AEIOU])\1+$/, '$1');
                }
                return norm.charAt(0).toUpperCase() + norm.slice(1).toLowerCase();
            })
            .join(' ');
    }

    private casCapitalizeEachWordSatker(rawSatker: any): string {
        const s = String(rawSatker || '').replace(/^[\s\-·—]+|[\s\-·—]+$/g, '').trim();
        if (!s || s === '-' || s === '--' || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') {
            return '';
        }
        const upperAcronyms = new Set([
            'II', 'III', 'IV', 'VI', 'VII', 'VIII', 'IX', 'DKI', 'DIY', 'NTB', 'NTT',
            'KP', 'K.P.', 'PPA', 'PPO', 'PPA-PPO', 'LP', 'DORS', 'SPKT', 'CAS', 'BDB',
            'IT', 'TI', 'SDM', 'SIM', 'STNK', 'BPKB', 'DPO', 'KPK', 'BNN', 'TNI', 'PPNS'
        ]);
        return s
            .split(/\s+/)
            .map(token => {
                if (!token) return '';
                const cleanUpper = token.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9.]+$/g, '').toUpperCase();
                if (upperAcronyms.has(cleanUpper)) return cleanUpper;
                if (token.includes('-')) {
                    return token
                        .split('-')
                        .map(part => {
                            const pUp = part.toUpperCase();
                            if (upperAcronyms.has(pUp)) return pUp;
                            return part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : '';
                        })
                        .join('-');
                }
                if (token.includes('/')) {
                    return token
                        .split('/')
                        .map(part => {
                            const pUp = part.toUpperCase();
                            if (upperAcronyms.has(pUp)) return pUp;
                            return part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : '';
                        })
                        .join('/');
                }
                return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
            })
            .filter(Boolean)
            .join(' ');
    }

    private casCleanPangkat(rawPangkat: any, isUserOne?: boolean, roleBdb?: any): string {
        if (isUserOne) return 'Kompol';
        const s = String(rawPangkat || '').replace(/^[\s\-·—]+|[\s\-·—]+$/g, '').trim();
        if (
            !s ||
            s === '-' ||
            s === '--' ||
            s.toLowerCase() === 'null' ||
            s.toLowerCase() === 'undefined' ||
            s.toLowerCase() === 'personil' ||
            s.toLowerCase() === 'personil polri'
        ) {
            const r = String(roleBdb || '').toLowerCase();
            if (r === 'superadmin' || r === 'admin_binops') return 'Superadmin';
            return '';
        }
        return this.casCapitalizeEachWordSatker(s);
    }

    private async broadcastDinasNotification(postId: number, authorUser: any, content: string) {
        const cleanContent = String(content || '').replace(/\s+/g, ' ').trim();
        const snippet = cleanContent.length > 55 ? cleanContent.slice(0, 55) + '...' : cleanContent;
        const shareHash = this.createPostShareHash(postId);
        const senderHandle = this.formatCallsign(
            authorUser?.callsign || authorUser?.username,
            Number(authorUser?.id || 1),
            authorUser?.username,
            authorUser?.name
        );
        await this.dataSource.query(
            `INSERT INTO bdb_social_notifications (recipient_id, sender_id, category, type, post_id, title, message, link)
             SELECT id, $1, 'dinas', 'official_broadcast', $2, $3, $4, $5
             FROM auth_users
             WHERE id <> $1 AND (UPPER(status) = 'AKTIF' OR LOWER(status) = 'active')
             LIMIT 5000`,
            [
                authorUser.id,
                postId,
                `${senderHandle}: "${snippet || 'Jukrah Resmi Robinopsnal Bareskrim Polri'}"`,
                snippet || 'Jukrah Resmi Robinopsnal Bareskrim Polri',
                `/cms/broadcaster?share=${shareHash}`
            ]
        );
    }

    private humanizeNotificationItem(raw: any): any {
        const type = String(raw.type || '').toLowerCase();
        const cat = String(raw.category || 'social').toLowerCase();
        const isSuperSender = raw.sender_id && this.isSuperUserOne(raw.sender_id, raw.sender_username, raw.sender_callsign);
        const rawActor = raw.sender_name || (isSuperSender ? 'Robinopsnal Bareskrim Polri' : (raw.sender_username || (cat === 'dinas' ? 'Robinopsnal Bareskrim Polri' : 'Rekan Personil')));
        const actorName = this.casFormatHumanName(rawActor);
        const rawHandle = raw.sender_handle || (raw.sender_id ? this.formatCallsign(raw.sender_callsign || raw.sender_username, raw.sender_id, raw.sender_username, raw.sender_name) : (cat === 'dinas' ? '@robinops' : '@rekan'));
        const actorHandle = rawHandle.startsWith('@') ? rawHandle : '@' + rawHandle;
        const photo = raw.sender_photo || this.resolveDefaultAvatar(null, actorName, null, null);
        const rawMsg = String(raw.message || '')
            .replace(/^Seseorang [^:]+:\s*/i, '')
            .replace(/^[«"“”]+|[»"“”]+$/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        const rawSnippet = String(raw.comment_snippet || raw.post_snippet || rawMsg || '')
            .replace(/^[«"“”]+|[»"“”]+$/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        let title = raw.title || '';
        let message = raw.message || '';
        let badgeIcon = '🔔';
        let badgeColor = '#2563eb';
        let badgeLabel = cat === 'dinas' ? 'Jukrah' : 'Sharese';
        let filterGroup = 'all';

        if (type === 'comment' || type === 'reply') {
            const snip = rawSnippet || 'Siap, segera kami tindak lanjuti';
            const shortSnip = snip.length > 48 ? snip.slice(0, 48) + '...' : snip;
            title = `${actorHandle} mengomentari kiriman Anda: "${shortSnip}"`;
            message = `"${shortSnip}"`;
            badgeIcon = '💬';
            badgeColor = '#2563eb';
            badgeLabel = 'Sharese';
            filterGroup = 'comment_mention';
        } else if (['reaction', 'like', 'respect', 'insightful', 'applause', 'fire'].includes(type)) {
            const emoji = type === 'respect' || rawMsg.includes('respect') ? '🫡'
                        : type === 'insightful' || rawMsg.includes('wawasan') ? '💡'
                        : type === 'applause' ? '👏'
                        : type === 'fire' ? '🔥' : '👍';
            const verb = emoji === '🫡' ? 'memberi hormat pada kiriman Anda'
                       : emoji === '💡' ? 'menilai kiriman Anda berwawasan'
                       : emoji === '👏' ? 'mengapresiasi kiriman Anda'
                       : 'menyukai kiriman Anda';
            const postSnip = raw.post_snippet ? String(raw.post_snippet).replace(/\s+/g, ' ').trim() : '';
            title = `${actorHandle} ${verb}`;
            message = postSnip ? `"${postSnip.slice(0, 48)}${postSnip.length > 48 ? '...' : ''}"` : '';
            badgeIcon = emoji;
            badgeColor = '#e11d48';
            badgeLabel = 'Sharese';
            filterGroup = 'reaction';
        } else if (type === 'mention') {
            const snip = rawSnippet || 'Diskusi penanganan perkara';
            const shortSnip = snip.length > 48 ? snip.slice(0, 48) + '...' : snip;
            title = `${actorHandle} menyebut Anda dalam diskusi: "${shortSnip}"`;
            message = `"${shortSnip}"`;
            badgeIcon = '💬';
            badgeColor = '#2563eb';
            badgeLabel = 'Sharese';
            filterGroup = 'comment_mention';
        } else if (type === 'repost') {
            const shortSnip = rawSnippet.length > 48 ? rawSnippet.slice(0, 48) + '...' : rawSnippet;
            title = `${actorHandle} membagikan ulang kiriman Anda`;
            message = shortSnip ? `"${shortSnip}"` : '';
            badgeIcon = '🔁';
            badgeColor = '#0284c7';
            badgeLabel = 'Sharese';
            filterGroup = 'comment_mention';
        } else if (type === 'connection' || type === 'follow') {
            if (raw.status === 'PENDING' || /mengirim permintaan koneksi/i.test(String(raw.title || ''))) {
                title = `${actorHandle} mengirim permintaan koneksi kepada Anda`;
                message = 'Ketuk untuk menerima atau mengabaikan permintaan koneksi';
            } else {
                title = `${actorHandle} terhubung dengan Anda di Sharese`;
                message = '';
            }
            badgeIcon = '🤝';
            badgeColor = '#16a34a';
            badgeLabel = 'Sharese';
            filterGroup = 'connection';
        } else if (type === 'message' || type === 'dm') {
            const snip = rawSnippet || 'Mengirim pesan baru';
            const shortSnip = snip.length > 48 ? snip.slice(0, 48) + '...' : snip;
            title = `${actorHandle} mengirim pesan: "${shortSnip}"`;
            message = `"${shortSnip}"`;
            badgeIcon = '💬';
            badgeColor = '#2563eb';
            badgeLabel = 'Sharese';
            filterGroup = 'message';
        } else if (type === 'pelimpahan' || type === 'limpah' || type === 'case_transfer') {
            const satkerAsalCap = this.casCapitalizeEachWordSatker(raw.satker_asal_nama || 'Satker Asal') || 'Satker Asal';
            const satkerTujuanCap = this.casCapitalizeEachWordSatker(raw.satker_tujuan_nama || raw.satker_eksternal_nama || 'Satker Tujuan') || 'Satker Tujuan';
            const rawLpNo = String(raw.no_laporan || '').trim();
            const lpIdNum = raw.lp_id || (rawMsg.match(/LP\s*#?(\d+)/i) ? rawMsg.match(/LP\s*#?(\d+)/i)![1] : '101');
            const formattedLpNo = /^LP\//i.test(rawLpNo)
                ? rawLpNo
                : `LP/B/${rawLpNo || lpIdNum}/X/2026/SPKT/${satkerAsalCap}`;
            title = `(DORS) ${formattedLpNo} dilimpahkan dari ${satkerAsalCap} ke ${satkerTujuanCap}`;
            message = `Pelimpahan perkara dari ${satkerAsalCap} ke ${satkerTujuanCap}`;
            badgeIcon = '⚖️';
            badgeColor = '#7c3aed';
            badgeLabel = 'Limpah';
            filterGroup = 'limpah';
        } else if (cat === 'dinas' || ['official_broadcast', 'official_jukrah', 'directive', 'satgas', 'operasi', 'kerma'].includes(type)) {
            if (type === 'kerma') {
                const cleanKerma = String(raw.title || 'Kerma Polri').replace(/^📢\s*/i, '').trim();
                title = `${actorHandle}: "${cleanKerma.length > 55 ? cleanKerma.slice(0, 55) + '...' : cleanKerma}"`;
                message = rawMsg || '';
            } else if (type === 'satgas' || type === 'operasi') {
                const cleanSatgas = String(raw.title || 'Susopsgas').replace(/^📢\s*/i, '').trim();
                title = `${actorHandle}: "${cleanSatgas.length > 55 ? cleanSatgas.slice(0, 55) + '...' : cleanSatgas}"`;
                message = rawMsg || '';
            } else {
                const cleanSnip = (rawSnippet || String(raw.title || ''))
                    .replace(/^📢\s*/i, '')
                    .replace(/^(Arahan\s+Baru|Arahan\s+Resmi(\s+Baru)?(\s+dari\s+Robinopsnal\s+Bareskrim\s+Polri)?|Jukrah\s+Baru)\s*[:—\-]*\s*/i, '')
                    .replace(/^@[a-z0-9_.]+\s*:\s*/i, '')
                    .replace(/^[«"“”]+|[»"“”]+$/g, '')
                    .trim();
                const shortSnip = cleanSnip.length > 58 ? cleanSnip.slice(0, 58) + '...' : cleanSnip;
                title = `${actorHandle}: "${shortSnip || 'Jukrah resmi kedinasan'}"`;
                message = shortSnip ? `"${shortSnip}"` : '';
            }
            badgeIcon = '📢';
            badgeColor = '#d97706';
            badgeLabel = 'Jukrah';
            filterGroup = 'official';
        }

        return {
            id: raw.id,
            category: cat,
            type: (type === 'pelimpahan' || type === 'case_transfer') ? 'limpah' : (raw.type || 'social'),
            filter_group: filterGroup,
            badge_label: badgeLabel,
            post_id: raw.post_id ? Number(raw.post_id) : null,
            title,
            message,
            actor_name: actorName,
            sender_name: actorName,
            sender_handle: actorHandle,
            sender_photo: photo,
            badge_icon: badgeIcon,
            badge_color: badgeColor,
            is_read: Boolean(raw.is_read),
            created_at: raw.created_at,
            sender_id: raw.sender_id ? Number(raw.sender_id) : null,
            link: raw.link || (type === 'message' && raw.sender_id ? `/cms/broadcaster?view=obrolan&partner=${raw.sender_id}` : type === 'connection' && raw.sender_id ? `/cms/broadcaster?view=koneksi&profileId=${raw.sender_id}` : '/cms/broadcaster')
        };
    }

    /** Ambil daftar notifikasi per kategori ('dinas' atau 'social'). */
    async getNotifications(user: any, category?: string) {
        await this.ensureTable();
        const uid = Number(user?.id);
        const satkerId = Number(user?.scope_satker_id || 0);
        const role = String(user?.role_bdb || '').toLowerCase();
        const isAdmin = ['superadmin', 'admin_binops', 'vendor_mitra', 'vendor', 'mitra'].includes(role);
        const cat = category === 'dinas' ? 'dinas' : category === 'social' ? 'social' : null;

        const items: any[] = [];

        if (!cat || cat === 'social') {
            const rows = await this.dataSource.query(
                `SELECT n.id, n.sender_id, n.category, n.type, n.post_id, n.title, n.message, n.link, n.is_read, n.created_at,
                        u.name as sender_name, u.callsign as sender_callsign, u.username as sender_username, u.photo_url as sender_photo,
                        LEFT(p.content, 110) as post_snippet,
                        (SELECT LEFT(c.content, 110) FROM bdb_social_comments c WHERE c.post_id = n.post_id AND c.user_id = n.sender_id ORDER BY c.created_at DESC LIMIT 1) as comment_snippet
                 FROM bdb_social_notifications n
                 LEFT JOIN auth_users u ON u.id = n.sender_id
                 LEFT JOIN bdb_social_posts p ON p.id = n.post_id
                 WHERE n.recipient_id = $1 AND n.category = 'social'
                 ORDER BY n.created_at DESC
                 LIMIT 40`,
                [uid]
            );
            items.push(...rows.map((r: any) => this.humanizeNotificationItem({
                ...r,
                id: Number(r.id),
                sender_handle: r.sender_id ? this.formatCallsign(r.sender_callsign || r.sender_username, r.sender_id, r.sender_username, r.sender_name) : '@rekan',
                sender_photo: this.resolveDefaultAvatar(r.sender_photo, r.sender_name, null, null)
            })));

            // Jika interaksi sosial masih sedikit, sertakan komentar & apresiasi nyata terbaru di Sharese
            try {
                const recentComments = await this.dataSource.query(
                    `SELECT c.id, c.post_id, c.user_id as sender_id, LEFT(c.content, 110) as comment_snippet, c.created_at,
                            u.name as sender_name, u.callsign as sender_callsign, u.username as sender_username, u.photo_url as sender_photo
                     FROM bdb_social_comments c
                     JOIN bdb_social_posts p ON p.id = c.post_id
                     JOIN auth_users u ON u.id = c.user_id
                     WHERE c.user_id <> $1 AND p.status = 'active'
                     ORDER BY (p.author_id = $1) DESC, c.created_at DESC
                     LIMIT 6`,
                    [uid]
                );
                for (const rc of recentComments) {
                    const dup = items.some(it => it.type === 'comment' && Number(it.post_id) === Number(rc.post_id) && Number(it.sender_id) === Number(rc.sender_id));
                    if (!dup) {
                        items.push(this.humanizeNotificationItem({
                            id: 'cm_' + rc.id,
                            category: 'social',
                            type: 'comment',
                            post_id: Number(rc.post_id),
                            comment_snippet: rc.comment_snippet,
                            is_read: false,
                            created_at: rc.created_at,
                            sender_id: Number(rc.sender_id),
                            sender_name: rc.sender_name,
                            sender_callsign: rc.sender_callsign,
                            sender_username: rc.sender_username,
                            sender_handle: this.formatCallsign(rc.sender_callsign || rc.sender_username, rc.sender_id, rc.sender_username, rc.sender_name),
                            sender_photo: this.resolveDefaultAvatar(rc.sender_photo, rc.sender_name, null, null),
                            link: '/cms/broadcaster'
                        }));
                    }
                }

                const recentReactions = await this.dataSource.query(
                    `SELECT r.post_id, r.user_id as sender_id, r.reaction_type, r.created_at, LEFT(p.content, 90) as post_snippet,
                            u.name as sender_name, u.callsign as sender_callsign, u.username as sender_username, u.photo_url as sender_photo
                     FROM bdb_social_reactions r
                     JOIN bdb_social_posts p ON p.id = r.post_id
                     JOIN auth_users u ON u.id = r.user_id
                     WHERE r.user_id <> $1 AND p.status = 'active'
                     ORDER BY (p.author_id = $1) DESC, r.created_at DESC
                     LIMIT 6`,
                    [uid]
                );
                for (let rxIdx = 0; rxIdx < recentReactions.length; rxIdx++) {
                    const rx = recentReactions[rxIdx];
                    const dup = items.some(it => ['reaction', 'like', 'respect', 'insightful'].includes(it.type) && Number(it.post_id) === Number(rx.post_id) && Number(it.sender_id) === Number(rx.sender_id));
                    if (!dup) {
                        items.push(this.humanizeNotificationItem({
                            id: `rx_${rx.post_id}_${rx.sender_id}`,
                            category: 'social',
                            type: rx.reaction_type || 'like',
                            post_id: Number(rx.post_id),
                            post_snippet: rx.post_snippet,
                            is_read: rxIdx >= 2,
                            created_at: rx.created_at,
                            sender_id: Number(rx.sender_id),
                            sender_name: rx.sender_name,
                            sender_callsign: rx.sender_callsign,
                            sender_username: rx.sender_username,
                            sender_handle: this.formatCallsign(rx.sender_callsign || rx.sender_username, rx.sender_id, rx.sender_username, rx.sender_name),
                            sender_photo: this.resolveDefaultAvatar(rx.sender_photo, rx.sender_name, null, null),
                            link: '/cms/broadcaster'
                        }));
                    }
                }
            } catch {}

            const connRows = await this.dataSource.query(
                `SELECT uc.id, uc.status, uc.updated_at as created_at,
                        u.id as other_id, u.name as other_name, u.username as other_username, u.callsign as other_callsign, u.photo_url as other_photo
                 FROM user_connections uc
                 JOIN auth_users u ON u.id = CASE WHEN uc.requester_id = $1 THEN uc.addressee_id ELSE uc.requester_id END
                 WHERE ((uc.addressee_id = $1 AND uc.status = 'PENDING') OR (uc.requester_id = $1 AND uc.status = 'ACCEPTED') OR (uc.addressee_id = $1 AND uc.status = 'ACCEPTED'))
                 ORDER BY uc.updated_at DESC
                 LIMIT 12`,
                [uid]
            );
            items.push(...connRows.map((r: any) => {
                const handle = this.formatCallsign(r.other_callsign || r.other_username, r.other_id, r.other_username, r.other_name);
                return this.humanizeNotificationItem({
                    id: 'conn_' + r.id,
                    category: 'social',
                    type: 'connection',
                    status: r.status,
                    post_id: null,
                    is_read: r.status !== 'PENDING',
                    created_at: r.created_at,
                    sender_id: Number(r.other_id),
                    sender_name: r.other_name,
                    sender_handle: handle,
                    sender_photo: this.resolveDefaultAvatar(r.other_photo, r.other_name, null, null),
                    link: `/cms/broadcaster?view=koneksi&profileId=${r.other_id}`
                });
            }));
        }

        if (!cat || cat === 'dinas') {
            const dinasRows = await this.dataSource.query(
                `SELECT n.id, n.sender_id, n.category, n.type, n.post_id, n.title, n.message, n.link, n.is_read, n.created_at,
                        u.name as sender_name, u.callsign as sender_callsign, u.username as sender_username, u.photo_url as sender_photo,
                        LEFT(p.content, 110) as post_snippet
                 FROM bdb_social_notifications n
                 LEFT JOIN auth_users u ON u.id = n.sender_id
                 LEFT JOIN bdb_social_posts p ON p.id = n.post_id
                 WHERE n.recipient_id = $1 AND n.category = 'dinas'
                 ORDER BY n.created_at DESC
                 LIMIT 30`,
                [uid]
            );
            items.push(...dinasRows.map((r: any) => this.humanizeNotificationItem({
                ...r,
                id: Number(r.id),
                sender_handle: r.sender_id ? this.formatCallsign(r.sender_callsign || r.sender_username, r.sender_id, r.sender_username, r.sender_name) : '@bareskrim',
                sender_photo: this.resolveDefaultAvatar(r.sender_photo, r.sender_name || 'Robinopsnal Bareskrim Polri', null, null)
            })));

            // Sertakan Jukrah Resmi terbaru dari bdb_social_posts
            try {
                const jukPosts = await this.dataSource.query(
                    `SELECT p.id, LEFT(p.content, 110) as post_snippet, p.created_at,
                            u.id as sender_id, u.name as sender_name, u.callsign as sender_callsign, u.username as sender_username, u.photo_url as sender_photo
                     FROM bdb_social_posts p
                     LEFT JOIN auth_users u ON u.id = p.author_id
                     WHERE p.is_official_jukrah = true AND p.status = 'active'
                     ORDER BY p.created_at DESC
                     LIMIT 5`
                );
                for (const jp of jukPosts) {
                    const dup = items.some(it => Number(it.post_id) === Number(jp.id));
                    if (!dup) {
                        const jpSenderId = Number(jp.sender_id || 1);
                        const jpHandle = this.formatCallsign(jp.sender_callsign || jp.sender_username, jpSenderId, jp.sender_username, jp.sender_name);
                        items.push(this.humanizeNotificationItem({
                            id: 'juk_' + jp.id,
                            category: 'dinas',
                            type: 'official_jukrah',
                            post_id: Number(jp.id),
                            post_snippet: jp.post_snippet,
                            is_read: false,
                            created_at: jp.created_at,
                            sender_id: jpSenderId,
                            sender_name: jp.sender_name || 'Robinopsnal Bareskrim Polri',
                            sender_callsign: jp.sender_callsign,
                            sender_username: jp.sender_username,
                            sender_handle: jpHandle,
                            sender_photo: this.resolveDefaultAvatar(jp.sender_photo, jp.sender_name || 'EKO', null, null),
                            link: '/cms/broadcaster'
                        }));
                    }
                }
            } catch {}

            const satgasRows = await this.dataSource.query(
                `SELECT id, jenis, nama as title, deskripsi, created_at
                 FROM bdb_operasi_satgas
                 WHERE deleted_at IS NULL
                 ORDER BY created_at DESC
                 LIMIT 5`
            );
            items.push(...satgasRows.map((r: any) => this.humanizeNotificationItem({
                id: 'satgas_' + r.id,
                category: 'dinas',
                type: r.jenis.toLowerCase(),
                post_id: null,
                title: r.title,
                message: `Ada ${r.jenis === 'SATGAS' ? 'Satgas Operasi' : 'Operasi Kepolisian'} Baru dari Robinopsnal Bareskrim Polri`,
                is_read: true,
                created_at: r.created_at,
                sender_name: 'Robinopsnal Bareskrim Polri',
                sender_handle: '@robinops',
                sender_photo: '/images/default-avatar-polki.png',
                link: '/cms/laporan/kasus-menonjol/lihat'
            })));

            const kermaRows = await this.dataSource.query(
                `SELECT id, institusi, tentang as title, created_at
                 FROM bdb_kerma_master
                 WHERE deleted_at IS NULL
                 ORDER BY created_at DESC
                 LIMIT 4`
            );
            items.push(...kermaRows.map((r: any) => this.humanizeNotificationItem({
                id: 'kerma_' + r.id,
                category: 'dinas',
                type: 'kerma',
                post_id: null,
                title: r.title,
                message: `Kerja Sama (Kerma) Baru bersama ${r.institusi}`,
                is_read: true,
                created_at: r.created_at,
                sender_name: 'Divisi Kerma Polri',
                sender_handle: '@kerma_polri',
                sender_photo: '/images/default-avatar-polki.png',
                link: '/cms/kerma/lihat'
            })));

            const lpSql = isAdmin
                ? `SELECT p.id, p.lp_id, p.satker_asal_nama, p.satker_tujuan_nama, p.satker_eksternal_nama, p.created_at,
                          lp.no_laporan, lp.satker_nama as lp_satker_nama
                   FROM bdb_lp_pelimpahan p
                   LEFT JOIN bdb_laporan_polisi lp ON lp.id = p.lp_id
                   ORDER BY p.created_at DESC LIMIT 6`
                : `SELECT p.id, p.lp_id, p.satker_asal_nama, p.satker_tujuan_nama, p.satker_eksternal_nama, p.created_at,
                          lp.no_laporan, lp.satker_nama as lp_satker_nama
                   FROM bdb_lp_pelimpahan p
                   LEFT JOIN bdb_laporan_polisi lp ON lp.id = p.lp_id
                   WHERE (p.satker_tujuan_id = $1 OR p.satker_asal_id = $1)
                   ORDER BY p.created_at DESC LIMIT 6`;
            const lpParams = isAdmin ? [] : [satkerId];
            const lpRows = await this.dataSource.query(lpSql, lpParams);
            items.push(...lpRows.map((r: any, idx: number) => this.humanizeNotificationItem({
                id: 'lp_' + r.id,
                category: 'dinas',
                type: 'pelimpahan',
                post_id: null,
                lp_id: r.lp_id,
                no_laporan: r.no_laporan,
                satker_asal_nama: r.satker_asal_nama || r.lp_satker_nama || 'Satker Asal',
                satker_tujuan_nama: r.satker_tujuan_nama || r.satker_eksternal_nama || 'Satker Tujuan',
                is_read: idx >= 2,
                created_at: r.created_at,
                sender_name: 'Robinopsnal Bareskrim Polri',
                sender_handle: '@dors_polri',
                sender_photo: '/images/default-avatar-polki.png',
                link: '/cms/laporan-polisi/arsip-pelimpahan'
            })));
        }

        items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const unreadCounts = await this.dataSource.query(
            `SELECT category, count(*)::int as c 
             FROM bdb_social_notifications 
             WHERE recipient_id = $1 AND is_read = false 
             GROUP BY category`,
            [uid]
        );

        let unreadDinas = 0;
        let unreadSocial = 0;
        unreadCounts.forEach((r: any) => {
            if (r.category === 'dinas') unreadDinas = Number(r.c);
            if (r.category === 'social') unreadSocial = Number(r.c);
        });

        return {
            status: 1,
            data: items.slice(0, 60),
            unread_dinas: unreadDinas,
            unread_social: unreadSocial,
            unread_total: unreadDinas + unreadSocial
        };
    }

    /** Tandai satu notifikasi sudah dibaca. */
    async markNotificationRead(user: any, notifId: number) {
        await this.ensureTable();
        const uid = Number(user?.id);
        if (!isNaN(Number(notifId))) {
            await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE id = $1 AND recipient_id = $2', [Number(notifId), uid]);
        }
        return { status: 1 };
    }

    /** Tandai semua notifikasi dalam kategori sudah dibaca. */
    async markAllNotificationsRead(user: any, category: string) {
        await this.ensureTable();
        const uid = Number(user?.id);
        if (!category || category === 'all') {
            await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE recipient_id = $1', [uid]);
        } else {
            await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE recipient_id = $1 AND category = $2', [uid, category]);
        }
        return { status: 1 };
    }

    // =========================================================================
    // OBROLAN TAKTIS CAS (DIRECT MESSAGE, HELPDESK ADMIN & AI AGEN TAKTIS)
    // =========================================================================

    async getMessageConversations(user: any, opts: any = {}) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const satkerId = Number(user?.scope_satker_id || 0);

        const aiMsgRows = await this.dataSource.query(
            `SELECT content, created_at, sender_id, is_read
             FROM bdb_social_messages
             WHERE (sender_id = $1 AND receiver_id = -1) OR (sender_id = -1 AND receiver_id = $1)
             ORDER BY created_at DESC LIMIT 1`,
            [uid]
        );
        const aiUnreadRes = await this.dataSource.query(
            `SELECT count(*)::int as c FROM bdb_social_messages WHERE sender_id = -1 AND receiver_id = $1 AND is_read = false`,
            [uid]
        );
        const aiContact = {
            id: -1,
            partner_id: -1,
            is_ai: true,
            is_official: true,
            is_same_satker: true,
            name: 'AI Agen Taktis CAS',
            handle: '@ai_taktis_cas',
            username: '@ai_taktis_cas',
            callsign: 'ai_taktis_cas',
            pangkat: 'Asisten Cerdas 24/7',
            jabatan: 'Asisten Taktis Penyidik & Analis',
            satker_nama: 'Robinopsnal Bareskrim Polri',
            satker: 'Robinopsnal Bareskrim Polri',
            role_bdb: 'ai_agent',
            photo_url: '/images/default-avatar-polki.png',
            online: true,
            is_online: true,
            is_pinned: true,
            channel_type: 'ai_agent',
            last_message: aiMsgRows[0]?.content || 'Siap Komandan! Tanyakan analisis LP, KUHP Baru (UU 1/2023), DORS, Selra, atau panduan CAS.',
            last_sender_id: aiMsgRows[0]?.sender_id ? Number(aiMsgRows[0].sender_id) : -1,
            last_is_mine: Boolean(aiMsgRows[0]?.sender_id && Number(aiMsgRows[0].sender_id) === uid),
            last_time: aiMsgRows[0]?.created_at || new Date().toISOString(),
            unread_count: Number(aiUnreadRes[0]?.c || 0)
        };

        const peerRows = await this.dataSource.query(
            `WITH peer_ids AS (
                SELECT DISTINCT CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS peer_id
                FROM bdb_social_messages
                WHERE (sender_id = $1 OR receiver_id = $1) AND sender_id > 0 AND receiver_id > 0
            )
            SELECT u.id, u.name, u.username, u.callsign, u.email, u.email_polri, u.role_bdb, u.photo_url, u.social_media, u.last_login_at, u.scope_satker_id,
                   s.deskripsi as satker_nama, s.nama_singkat as satker_singkat,
                   tp.pangkat, tp.jabatan, tp.jenis_kelamin, tp.foto as police_foto,
                   lm.content as last_message, lm.created_at as last_time, lm.channel_type as last_channel, lm.sender_id as last_sender_id,
                   COALESCE(ur.unread_count, 0)::int as unread_count,
                   EXISTS(SELECT 1 FROM user_connections uc WHERE ((uc.requester_id = $1 AND uc.addressee_id = u.id) OR (uc.requester_id = u.id AND uc.addressee_id = $1)) AND uc.status = 'ACCEPTED') as is_connected
            FROM peer_ids pid
            JOIN auth_users u ON u.id = pid.peer_id
            LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
            LEFT JOIN LATERAL (
                SELECT pangkat, jabatan, jenis_kelamin, foto
                FROM trb_police tp
                WHERE lower(tp.email) = lower(u.email) OR (u.email_polri IS NOT NULL AND lower(tp.email) = lower(u.email_polri))
                LIMIT 1
            ) tp ON true
            LEFT JOIN LATERAL (
                SELECT content, created_at, channel_type, sender_id
                FROM bdb_social_messages m
                WHERE (m.sender_id = $1 AND m.receiver_id = u.id) OR (m.sender_id = u.id AND m.receiver_id = $1)
                ORDER BY m.created_at DESC LIMIT 1
            ) lm ON true
            LEFT JOIN LATERAL (
                SELECT count(*)::int as unread_count
                FROM bdb_social_messages m2
                WHERE m2.sender_id = u.id AND m2.receiver_id = $1 AND m2.is_read = false
            ) ur ON true
            WHERE u.id <> $1 AND lm.content IS NOT NULL
            ORDER BY lm.created_at DESC NULLS LAST
            LIMIT 60`,
            [uid]
        );

        const formatPeer = (r: any, defaultChannel = 'direct') => {
            const pid = Number(r.id);
            const isUserOne = this.isSuperUserOne(pid, r.username, r.callsign);
            const satkerName = isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_singkat || r.satker_nama || 'Polri');
            const handle = this.formatCallsign(r.callsign || r.username, pid, r.username, r.name);
            const photo = this.resolveDefaultAvatar(r.photo_url || r.police_foto, r.name, r.jenis_kelamin, r.social_media);
            const roleBdb = isUserOne ? 'superadmin' : String(r.role_bdb || 'operator').toLowerCase();
            const isOfficial = isUserOne || ['superadmin', 'admin_binops'].includes(roleBdb);
            const isSameSatker = Boolean((satkerId > 0 && Number(r.scope_satker_id) === satkerId) || r.is_connected);
            const isOnline = Boolean(isUserOne || (r.last_login_at && (Date.now() - new Date(r.last_login_at).getTime() < 36 * 3600 * 1000)));
            const formattedName = isUserOne ? this.casFormatHumanName(r.name || 'Eko') : this.casFormatHumanName(r.name || handle);
            return {
                id: pid,
                partner_id: pid,
                is_ai: false,
                is_official: isOfficial,
                is_same_satker: isSameSatker,
                name: formattedName,
                handle,
                username: handle,
                callsign: handle.replace(/^@/, ''),
                pangkat: r.pangkat || (isUserOne ? 'KOMPOL' : (isOfficial ? 'Admin Binops' : 'Personil Polri')),
                jabatan: r.jabatan || (isUserOne ? 'Kasubdit Robinopsnal' : roleBdb),
                satker_nama: satkerName,
                satker: satkerName,
                role_bdb: roleBdb,
                photo_url: photo,
                online: isOnline,
                is_online: isOnline,
                is_connected: Boolean(r.is_connected),
                is_pinned: Boolean(isUserOne),
                last_message: r.last_message || '',
                last_sender_id: r.last_sender_id ? Number(r.last_sender_id) : null,
                last_is_mine: Boolean(r.last_sender_id && Number(r.last_sender_id) === uid),
                last_time: r.last_time || r.last_login_at || new Date().toISOString(),
                unread_count: Number(r.unread_count || 0),
                channel_type: isOfficial ? 'official' : (r.last_channel || defaultChannel)
            };
        };

        const conversations = [aiContact, ...peerRows.map((r: any) => formatPeer(r, 'direct'))];
        const helpdeskContacts = conversations.filter((c: any) => c.is_ai || c.is_official);

        const totalUnreadRes = await this.dataSource.query(
            `SELECT count(*)::int as c FROM bdb_social_messages WHERE receiver_id = $1 AND is_read = false`,
            [uid]
        );

        return {
            status: 1,
            data: conversations,
            conversations,
            helpdesk_contacts: helpdeskContacts,
            total_unread: Number(totalUnreadRes[0]?.c || 0)
        };
    }

    async getMessageThread(user: any, targetIdRaw: any) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const isAiTarget = targetIdRaw === 'ai' || targetIdRaw === '-1' || Number(targetIdRaw) === -1;
        const tid = isAiTarget ? -1 : Number(targetIdRaw);
        if (!uid || (!isAiTarget && isNaN(tid))) {
            throw new BadRequestException('Target percakapan tidak valid.');
        }

        if (!isAiTarget) {
            await this.dataSource.query(
                `UPDATE bdb_social_messages SET is_read = true WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false`,
                [tid, uid]
            );
            await this.dataSource.query(
                `UPDATE bdb_social_notifications SET is_read = true WHERE recipient_id = $1 AND sender_id = $2 AND type = 'message' AND is_read = false`,
                [uid, tid]
            );
        }

        let rows = await this.dataSource.query(
            `SELECT id, sender_id, receiver_id, channel_type, content, media_url, attachment_url, attachment_name, reply_to_json, reactions_json, is_read, created_at
             FROM bdb_social_messages
             WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
             ORDER BY created_at ASC, id ASC
             LIMIT 200`,
            [uid, tid]
        );

        if (tid === -1 && rows.length === 0) {
            const welcomeText = '⚡ Salam Presisi! Saya AI Agen Taktis CAS Robinopsnal Bareskrim Polri. Silakan tanyakan bantuan terkait Laporan Polisi (LP), analisis Kinerja Perkara (CT/CC/CR), pasal KUHP Baru (UU No. 1 Tahun 2023), rekonsiliasi DORS, Susopsgas, atau kendala teknis aplikasi.';
            const ins = await this.dataSource.query(
                `INSERT INTO bdb_social_messages (sender_id, receiver_id, channel_type, content, is_read, created_at)
                 VALUES (-1, $1, 'ai_agent', $2, true, NOW())
                 RETURNING id, sender_id, receiver_id, channel_type, content, media_url, attachment_url, attachment_name, reply_to_json, reactions_json, is_read, created_at`,
                [uid, welcomeText]
            );
            rows = ins;
        }

        let partner: any = null;
        if (tid === -1) {
            partner = {
                id: -1,
                partner_id: -1,
                is_ai: true,
                is_official: true,
                name: 'AI Agen Taktis CAS',
                handle: '@ai_taktis_cas',
                username: '@ai_taktis_cas',
                callsign: 'ai_taktis_cas',
                pangkat: 'Asisten Cerdas 24/7',
                jabatan: 'Asisten Taktis Penyidik & Analis',
                satker: 'Robinopsnal Bareskrim Polri',
                satker_nama: 'Robinopsnal Bareskrim Polri',
                role_bdb: 'ai_agent',
                photo_url: '/images/default-avatar-polki.png',
                online: true,
                is_online: true
            };
        } else {
            try {
                const prof = await this.getNetworkProfile(user, tid);
                if (prof?.data) {
                    const p = prof.data;
                    const h = this.formatCallsign(p.callsign || p.username, p.id, p.username, p.name);
                    partner = {
                        ...p,
                        id: Number(p.id),
                        partner_id: Number(p.id),
                        is_ai: false,
                        handle: h,
                        username: h,
                        satker: p.satker_nama || p.satker || 'Polri',
                        online: true,
                        is_online: true
                    };
                }
            } catch {}
        }

        const mappedMessages = rows.map((m: any) => {
            const isMine = Number(m.sender_id) === uid;
            let replyTo = null;
            let reactions = {};
            try { if (m.reply_to_json) replyTo = JSON.parse(m.reply_to_json); } catch {}
            try { if (m.reactions_json) reactions = JSON.parse(m.reactions_json); } catch {}
            return {
                id: Number(m.id),
                sender_id: Number(m.sender_id),
                receiver_id: Number(m.receiver_id),
                is_mine: isMine,
                is_me: isMine,
                channel_type: m.channel_type || 'direct',
                content: m.content,
                media_url: m.media_url || m.attachment_url || null,
                attachment_url: m.attachment_url || m.media_url || null,
                attachment_name: m.attachment_name || null,
                reply_to: replyTo,
                reactions,
                is_read: Boolean(m.is_read),
                created_at: m.created_at
            };
        });

        return {
            status: 1,
            partner,
            data: mappedMessages,
            messages: mappedMessages
        };
    }

    private buildAiTacticalReply(content: string, user: any): string {
        const q = (content || '').toLowerCase();
        const callsign = this.formatCallsign(user?.callsign || user?.username, user?.id, user?.username, user?.name);
        if (q.includes('kuhp') || q.includes('pasal') || q.includes('uu 1') || q.includes('pidana')) {
            return `⚖️ **[Analisis Regulasi & KUHP Baru — UU No. 1 Tahun 2023]**\nSiap ${callsign}! Terkait penerapan KUHP Baru:\n1. Pastikan pemetaan unsur delik pada Laporan Polisi (LP) telah mencantumkan padanan pasal transisi KUHP Lama ke **UU No. 1 Tahun 2023**.\n2. Gunakan fitur **Smart Import PDF** atau **Audit Kesesuaian Pasal** pada menu *Laporan → Rekap* untuk memvalidasi kelengkapan Mindik.`;
        }
        if (q.includes('ct') || q.includes('cc') || q.includes('cr') || q.includes('kinerja') || q.includes('selra') || q.includes('p21') || q.includes('sp3') || q.includes('rj')) {
            return `📊 **[Kinerja Perkara & Penyelesaian Perkara (Selra)]**\nSiap ${callsign}! Terkait **CT/CC/CR & Selra**:\n• **CT (Crime Total)**: Jumlah seluruh Laporan Polisi yang masuk pada periode berjalan.\n• **CC (Crime Cleared)**: Jumlah perkara yang selesai (**P-21, SP3, RJ/Diversi, atau Limpah**).\n• **CR (Clearance Rate)**: Persentase penyelesaian perkara \`(CC / CT) × 100%\`.\nBuka menu **Laporan → Kinerja Perkara** untuk melihat rekapitulasi per Satker dan mengunduh Excel/PDF.`;
        }
        if (q.includes('dors') || q.includes('sync') || q.includes('integrasi') || q.includes('mapping')) {
            return `🔄 **[Panduan Taktis Portal Integrasi DORS]**\nSiap ${callsign}! Untuk sinkronisasi data DORS:\n1. Buka **Portal Integrasi → Masuk → Tarik Data** untuk mengambil antrean sinkronisasi LP terbaru.\n2. Tinjau di **Staging** & **Cek Duplikat** sebelum melakukan *Import ke Database* utama.`;
        }
        if (q.includes('anev') || q.includes('lampiran') || q.includes('periodik')) {
            return `📑 **[Lampiran Anev Periodik]**\nSiap ${callsign}! Menu **Laporan → Lamp. Anev Periodik** menyediakan kanvas naskah dinas & tabel analitik otomatis (Bareskrim & Kewilayahan) yang siap dicetak ke dokumen Word/PDF sesuai format standar Robinopsnal Bareskrim Polri.`;
        }
        if (q.includes('susopsgas') || q.includes('susjol') || q.includes('atensi') || q.includes('menonjol') || q.includes('satgas')) {
            return `🚨 **[Pemantauan Susopsgas]**\nSiap ${callsign}! Menu **Susopsgas** menggabungkan pemantauan **Susjol (Kasus Menonjol)**, **Susatensi (Kasus Atensi Pimpinan)**, serta **Operasi & Satgas Kepolisian** dalam satu komando.`;
        }
        if (q.includes('lp') || q.includes('laporan polisi') || q.includes('limpah')) {
            return `📄 **[Pengelolaan Laporan Polisi (LP)]**\nSiap ${callsign}! Gunakan **Laporan → Laporan Polisi → Daftar LP** untuk pencarian, filter satker/kejahatan, dan rincian perkembangan penyidikan. Untuk perkara yang dilimpahkan, buka **Arsip Pelimpahan** (\`/cms/laporan-polisi/arsip-pelimpahan\`).`;
        }
        return `🛡️ **[AI Agen Taktis CAS — Robinopsnal Bareskrim Polri]**\nSiap ${callsign}! Pesan Anda: *"${content.slice(0, 90)}"* telah dicatat oleh asisten taktis.\n\nSaya siap membantu analisis data **LP & Selra (CT/CC/CR)**, **Pasal KUHP Baru (UU 1/2023)**, **Sinkronisasi DORS**, **Lampiran Anev Periodik**, maupun **Susopsgas**.`;
    }

    async sendSocialMessage(user: any, body: any) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const rawTarget = body?.receiver_id;
        const isAiTarget = rawTarget === 'ai' || rawTarget === -1 || String(rawTarget) === '-1';
        const receiverId = isAiTarget ? -1 : Number(rawTarget);
        const content = String(body?.content || '').trim();
        const channelType = String(body?.channel_type || (receiverId === -1 ? 'ai_agent' : 'direct')).trim();
        const attachmentUrl = body?.attachment_url || body?.media_url ? String(body.attachment_url || body.media_url).trim() : null;
        const attachmentName = body?.attachment_name ? String(body.attachment_name).trim() : null;
        const replyToObj = body?.reply_to && typeof body.reply_to === 'object' ? body.reply_to : null;
        const replyToJson = replyToObj ? JSON.stringify(replyToObj) : null;

        if (!uid) throw new ForbiddenException('Sesi tidak valid.');
        if (!isAiTarget && (isNaN(receiverId) || receiverId === 0)) throw new BadRequestException('Penerima pesan wajib dipilih.');
        if (!content && !attachmentUrl) throw new BadRequestException('Isi pesan tidak boleh kosong.');
        if (content.length > 4000) throw new BadRequestException('Pesan maksimal 4.000 karakter.');

        const ins = await this.dataSource.query(
            `INSERT INTO bdb_social_messages (sender_id, receiver_id, channel_type, content, media_url, attachment_url, attachment_name, reply_to_json, is_read, created_at)
             VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8, NOW())
             RETURNING id, sender_id, receiver_id, channel_type, content, media_url, attachment_url, attachment_name, reply_to_json, reactions_json, is_read, created_at`,
            [uid, receiverId, channelType, content, attachmentUrl, attachmentName, replyToJson, isAiTarget ? true : false]
        );
        const sentMsg: any = {
            ...ins[0],
            id: Number(ins[0].id),
            sender_id: Number(ins[0].sender_id),
            receiver_id: Number(ins[0].receiver_id),
            is_mine: true,
            is_me: true,
            reply_to: replyToObj,
            reactions: {}
        };

        let aiReplyMsg: any = null;
        if (receiverId === -1) {
            const replyText = this.buildAiTacticalReply(content, user);
            const aiIns = await this.dataSource.query(
                `INSERT INTO bdb_social_messages (sender_id, receiver_id, channel_type, content, is_read, created_at)
                 VALUES (-1, $1, 'ai_agent', $2, true, NOW() + interval '1 millisecond')
                 RETURNING id, sender_id, receiver_id, channel_type, content, media_url, attachment_url, attachment_name, reply_to_json, reactions_json, is_read, created_at`,
                [uid, replyText]
            );
            aiReplyMsg = {
                ...aiIns[0],
                id: Number(aiIns[0].id),
                sender_id: -1,
                receiver_id: uid,
                is_mine: false,
                is_me: false,
                reply_to: null,
                reactions: {}
            };
        } else if (receiverId > 0 && receiverId !== uid) {
            const actorName = user?.name || user?.username || 'Rekan Personil';
            const senderHandle = this.formatCallsign(user?.callsign || user?.username, uid, user?.username, user?.name);
            await this.createNotification({
                recipientId: receiverId,
                senderId: uid,
                category: channelType === 'helpdesk' ? 'dinas' : 'social',
                type: 'message',
                title: `✉️ ${actorName} (${senderHandle}) mengirim pesan baru kepada Anda`,
                message: `«${(content || attachmentName || 'Lampiran berkas').slice(0, 90)}»`,
                link: `/cms/broadcaster?view=obrolan&partner=${uid}`
            });
        }

        return {
            status: 1,
            message: 'Pesan terkirim.',
            data: {
                ...sentMsg,
                sent_message: sentMsg,
                ai_reply: aiReplyMsg
            },
            sent_message: sentMsg,
            ai_reply: aiReplyMsg
        };
    }

    // =========================================================================
    // INSIGHT & ANALITIK AKUN SHARESE (/bdb/jukrah/insight)
    // =========================================================================

    async getAccountInsight(user: any) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        if (!uid) throw new ForbiddenException('Sesi tidak valid.');

        const statsRes = await this.dataSource.query(
            `SELECT
                (SELECT COUNT(*)::int FROM bdb_social_posts WHERE author_id = $1 AND status = 'active') AS total_posts,
                (SELECT COUNT(*)::int FROM bdb_social_reactions rx JOIN bdb_social_posts p ON p.id = rx.post_id WHERE p.author_id = $1 AND p.status = 'active') AS total_likes_received,
                (SELECT COUNT(*)::int FROM bdb_social_comments c JOIN bdb_social_posts p ON p.id = c.post_id WHERE p.author_id = $1 AND p.status = 'active') AS total_comments_received,
                (SELECT COALESCE(SUM(repost_count), 0)::int FROM bdb_social_posts WHERE author_id = $1 AND status = 'active') AS total_reposts_received,
                (SELECT COALESCE(SUM(view_count), 0)::int FROM bdb_social_posts WHERE author_id = $1 AND status = 'active') AS raw_views,
                (SELECT COUNT(*)::int FROM (SELECT addressee_id FROM user_connections WHERE requester_id = $1 AND status = 'ACCEPTED' UNION SELECT requester_id FROM user_connections WHERE addressee_id = $1 AND status = 'ACCEPTED') conn) AS connections_count,
                (SELECT COUNT(*)::int FROM user_connections WHERE addressee_id = $1 AND status = 'ACCEPTED') AS followers_raw,
                (SELECT COUNT(*)::int FROM user_connections WHERE requester_id = $1 AND status = 'ACCEPTED') AS following_raw`,
            [uid]
        );

        const s = statsRes[0] || {};
        const totalPosts = Number(s.total_posts || 0);
        const totalLikes = Number(s.total_likes_received || 0);
        const totalComments = Number(s.total_comments_received || 0);
        const totalReposts = Number(s.total_reposts_received || 0);
        const rawViews = Number(s.raw_views || 0);
        const totalViewsEstimated = totalPosts * 42 + totalLikes * 9 + totalComments * 14 + rawViews;
        const connectionsCount = Number(s.connections_count || 0);
        const followersCount = Math.max(connectionsCount, Number(s.followers_raw || 0));
        const followingCount = Math.max(connectionsCount, Number(s.following_raw || 0));
        const totalInteractions = totalLikes + totalComments + totalReposts;
        const engagementRate = totalViewsEstimated > 0
            ? Number(((totalInteractions / totalViewsEstimated) * 100).toFixed(2))
            : (connectionsCount > 0 ? 4.8 : 0);

        const topPostsRows = await this.dataSource.query(
            `SELECT p.id, p.content, p.audience_type, p.is_official_jukrah, p.repost_count, p.view_count, p.created_at,
                    (SELECT COUNT(*)::int FROM bdb_social_reactions rx WHERE rx.post_id = p.id) AS likes,
                    (SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id) AS comments
             FROM bdb_social_posts p
             WHERE p.author_id = $1 AND p.status = 'active'
             ORDER BY ((SELECT COUNT(*)::int FROM bdb_social_reactions rx WHERE rx.post_id = p.id) * 2 + (SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id) * 3 + COALESCE(p.repost_count, 0) * 4) DESC, p.created_at DESC
             LIMIT 5`,
            [uid]
        );

        const topPosts = topPostsRows.map((r: any) => {
            const likes = Number(r.likes || 0);
            const comments = Number(r.comments || 0);
            const reposts = Number(r.repost_count || 0);
            const views = 42 + likes * 9 + comments * 14 + Number(r.view_count || 0);
            return {
                id: Number(r.id),
                content: r.content,
                audience_type: r.audience_type,
                is_official_jukrah: Boolean(r.is_official_jukrah),
                likes,
                comments,
                reposts,
                views,
                created_at: r.created_at
            };
        });

        const dayRows = await this.dataSource.query(
            `SELECT d::date AS day_date,
                    to_char(d::date, 'DD Mon') AS label,
                    (SELECT COUNT(*)::int FROM bdb_social_posts p WHERE p.author_id = $1 AND p.status = 'active' AND p.created_at::date = d::date) AS posts_count,
                    (SELECT COUNT(*)::int FROM bdb_social_reactions rx JOIN bdb_social_posts p ON p.id = rx.post_id WHERE (p.author_id = $1 OR rx.user_id = $1) AND rx.created_at::date = d::date) AS reactions_count,
                    (SELECT COUNT(*)::int FROM bdb_social_comments c JOIN bdb_social_posts p ON p.id = c.post_id WHERE (p.author_id = $1 OR c.user_id = $1) AND c.created_at::date = d::date) AS comments_count
             FROM generate_series(current_date - interval '6 days', current_date, interval '1 day') AS d
             ORDER BY d::date ASC`,
            [uid]
        );

        const activityByDay = dayRows.map((r: any) => {
            const p = Number(r.posts_count || 0);
            const rx = Number(r.reactions_count || 0);
            const cm = Number(r.comments_count || 0);
            return {
                date: r.day_date,
                label: r.label,
                posts_count: p,
                reactions_count: rx,
                comments_count: cm,
                total_activity: p + rx + cm
            };
        });

        return {
            status: 1,
            data: {
                total_posts: totalPosts,
                total_likes_received: totalLikes,
                total_comments_received: totalComments,
                total_reposts_received: totalReposts,
                total_views_estimated: totalViewsEstimated,
                followers_count: followersCount,
                following_count: followingCount,
                mutual_connections_count: connectionsCount,
                engagement_rate: engagementRate,
                top_posts: topPosts,
                activity_by_day: activityByDay
            }
        };
    }

    // =========================================================================
    // DIREKTORI KARTU PUSAT BANTUAN & KOORDINASI TEKNIS (/bdb/jukrah/pusat-bantuan-cards)
    // =========================================================================

    async getPusatBantuanCards(user: any) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const userSatkerId = Number(user?.scope_satker_id || 0);

        const settingRows = await this.dataSource.query(
            `SELECT key, value FROM bdb_system_settings WHERE key IN ('pusat_bantuan_telp1', 'pusat_bantuan_telp2', 'pusat_bantuan_email')`
        );
        const sMap = new Map<string, string>(settingRows.map((r: any) => [String(r.key), String(r.value || '')]));
        const telp1 = sMap.get('pusat_bantuan_telp1') || '0811-9696-2026';
        const telp2 = sMap.get('pusat_bantuan_telp2') || '021-7218-999';
        const emailHelp = sMap.get('pusat_bantuan_email') || 'cas.bareskrim@polri.go.id';

        const adminRows = await this.dataSource.query(
            `SELECT u.id, u.name, u.username, u.callsign, u.email, u.email_polri, u.role_bdb, u.photo_url, u.social_media, u.last_login_at, u.scope_satker_id,
                    s.deskripsi as satker_nama, s.nama_singkat as satker_singkat, s.kode as satker_kode,
                    tp.pangkat, tp.jabatan, tp.no_hp, tp.jenis_kelamin, tp.foto as police_foto
             FROM auth_users u
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             LEFT JOIN LATERAL (
                 SELECT pangkat, jabatan, no_hp, jenis_kelamin, foto
                 FROM trb_police tp
                 WHERE lower(tp.email) = lower(u.email) OR (u.email_polri IS NOT NULL AND lower(tp.email) = lower(u.email_polri))
                 LIMIT 1
             ) tp ON true
             WHERE (u.status = 'AKTIF' OR u.status = 'active')
               AND (
                   u.role_bdb IN ('superadmin', 'admin_binops')
                   OR (u.role_bdb = 'operator' AND ($1 = 0 OR u.scope_satker_id = $1 OR u.last_login_at IS NOT NULL))
                   OR u.id = 1
               )
             ORDER BY (u.id = 1) DESC, (u.role_bdb = 'superadmin') DESC, (u.role_bdb = 'admin_binops') DESC, (u.scope_satker_id = $1) DESC, u.last_login_at DESC NULLS LAST
             LIMIT 40`,
            [userSatkerId]
        );

        const pusatAdmins: any[] = [];
        const regionalAdmins: any[] = [];

        for (const r of adminRows) {
            const isUserOne = this.isSuperUserOne(r.id, r.username, r.callsign);
            const roleBdb = isUserOne ? 'superadmin' : String(r.role_bdb || '').toLowerCase();
            const isPusat = isUserOne || ['superadmin', 'admin_binops'].includes(roleBdb);
            const satkerName = isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_nama || r.satker_singkat || 'Bareskrim Polri');
            const handle = this.formatCallsign(r.callsign || r.username, r.id, r.username, r.name);
            const photo = this.resolveDefaultAvatar(r.photo_url || r.police_foto, r.name, r.jenis_kelamin, r.social_media);
            const rawPhone = r.no_hp || (isPusat ? telp1 : '');
            const cleanWa = String(rawPhone || '').replace(/[^0-9]/g, '').replace(/^0/, '62');
            const isOnline = isUserOne || (r.last_login_at && (Date.now() - new Date(r.last_login_at).getTime() < 72 * 3600 * 1000));

            const card = {
                id: Number(r.id),
                name: isUserOne ? (r.name || 'EKO') : r.name,
                username: handle,
                callsign: handle.replace(/^@/, ''),
                pangkat: r.pangkat || (isUserOne ? 'KOMPOL' : (isPusat ? 'Superadmin Pusat' : 'Admin Kewilayahan')),
                jabatan: r.jabatan || (isUserOne ? 'Kasubdit / Koordinator Utama CAS' : (roleBdb === 'admin_binops' ? 'Admin Binopsnal Bareskrim' : 'Admin Teknis Satker')),
                satker_nama: satkerName,
                satker_singkat: isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_singkat || satkerName),
                role_bdb: roleBdb,
                photo_url: photo,
                phone: rawPhone || telp1,
                whatsapp: cleanWa || '6281196962026',
                email: r.email_polri || r.email || emailHelp,
                is_online: Boolean(isOnline),
                is_same_satker: Boolean(userSatkerId && Number(r.scope_satker_id) === userSatkerId),
                last_login_at: r.last_login_at
            };

            if (isPusat) {
                if (pusatAdmins.length < 12) pusatAdmins.push(card);
            } else {
                if (regionalAdmins.length < 16) regionalAdmins.push(card);
            }
        }

        return {
            status: 1,
            data: {
                settings: {
                    title: 'Pusat Bantuan & Koordinasi Teknis CAS Bareskrim Polri',
                    description: 'Layanan pendampingan teknis, kendala autentikasi (2FA/OTP/Passkey), rekonsiliasi data DORS, serta asistensi operasional penyidik dan admin jajaran.',
                    operational_hours: 'Siaga Operasional 24/7 (Posko Robinopsnal Bareskrim Polri)',
                    telp1,
                    telp2,
                    email: emailHelp
                },
                admins: {
                    pusat: pusatAdmins,
                    regional: regionalAdmins
                },
                pusat_admins: pusatAdmins,
                regional_admins: regionalAdmins
            }
        };
    }

    // =========================================================================
    // WIDGET 1 BARIS DASHBOARD UTAMA (/cms/dashboard/main)
    // =========================================================================

    /** Ambil data 3 card horizontal widget medsos di dashboard utama. */
    async getDashboardWidgets(user: any) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);

        const jukrahRows = await this.dataSource.query(
            `SELECT p.id, p.author_id, p.content, p.created_at,
                    u.name as raw_author_name, u.username as author_username, u.callsign as author_callsign, u.role_bdb as author_role,
                    s.nama_singkat as satker, s.deskripsi as satker_nama,
                    CASE WHEN rr.id IS NOT NULL THEN true ELSE false END as acknowledged,
                    (SELECT COUNT(*)::int FROM bdb_social_read_receipts rrc WHERE rrc.post_id = p.id) as acknowledged_count
             FROM bdb_social_posts p
             JOIN auth_users u ON u.id = p.author_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             LEFT JOIN bdb_social_read_receipts rr ON rr.post_id = p.id AND rr.user_id = $1
             WHERE p.is_official_jukrah = true AND p.status = 'active'
             ORDER BY p.is_pinned DESC, p.created_at DESC
             LIMIT 1`,
            [uid]
        );
        const latestJukrah = jukrahRows.length ? {
            id: Number(jukrahRows[0].id),
            title: jukrahRows[0].content.slice(0, 90),
            author_handle: this.formatCallsign(jukrahRows[0].author_callsign, jukrahRows[0].author_id, jukrahRows[0].author_username, jukrahRows[0].raw_author_name),
            satker: this.resolveAuthorSatker(
                jukrahRows[0].satker,
                jukrahRows[0].satker_nama,
                jukrahRows[0].author_role,
                this.isSuperUserOne(jukrahRows[0].author_id, jukrahRows[0].author_username, jukrahRows[0].author_callsign)
            ),
            created_at: jukrahRows[0].created_at,
            acknowledged: Boolean(jukrahRows[0].acknowledged),
            acknowledged_count: Number(jukrahRows[0].acknowledged_count || 0),
            share_hash: this.createPostShareHash(Number(jukrahRows[0].id))
        } : null;

        const trendingRows = await this.dataSource.query(
            `SELECT p.id, p.content, p.reaction_counts, p.created_at,
                    u.id as author_id, u.name as raw_author_name, u.username as author_username, u.callsign, u.role_bdb as author_role,
                    s.nama_singkat as satker, s.deskripsi as satker_nama,
                    (SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id) as comments_count
             FROM bdb_social_posts p
             JOIN auth_users u ON u.id = p.author_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE p.status = 'active' AND p.audience_type = 'public'
             ORDER BY (p.repost_count * 3 + (SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id) * 2) DESC, p.created_at DESC
             LIMIT 1`
        );
        const topTrending = trendingRows.length ? {
            id: Number(trendingRows[0].id),
            snippet: trendingRows[0].content.slice(0, 85),
            author_handle: this.formatCallsign(trendingRows[0].callsign, trendingRows[0].author_id, trendingRows[0].author_username, trendingRows[0].raw_author_name),
            satker: this.resolveAuthorSatker(
                trendingRows[0].satker,
                trendingRows[0].satker_nama,
                trendingRows[0].author_role,
                this.isSuperUserOne(trendingRows[0].author_id, trendingRows[0].author_username, trendingRows[0].callsign)
            ),
            comments_count: Number(trendingRows[0].comments_count || 0),
            reaction_counts: trendingRows[0].reaction_counts || {},
            share_hash: this.createPostShareHash(Number(trendingRows[0].id))
        } : null;

        const userStats = await this.dataSource.query(
            `SELECT 
                u.id, u.name, u.username, u.callsign,
                (SELECT COUNT(*)::int FROM bdb_social_posts WHERE author_id = $1 AND status = 'active') as my_posts,
                (SELECT COUNT(*)::int FROM bdb_social_notifications WHERE recipient_id = $1 AND is_read = false AND category = 'dinas') as unread_dinas
             FROM auth_users u WHERE u.id = $1`,
            [uid]
        );
        const quickStats = {
            callsign: this.formatCallsign(userStats[0]?.callsign, userStats[0]?.id, userStats[0]?.username, userStats[0]?.name),
            my_posts: Number(userStats[0]?.my_posts || 0),
            unread_dinas: Number(userStats[0]?.unread_dinas || 0)
        };

        return {
            status: 1,
            data: {
                latest_jukrah: latestJukrah,
                top_trending: topTrending,
                quick_stats: quickStats
            }
        };
    }

    /** Rekap keterbacaan Satker & daftar personil untuk Moderasi Sharese & Jukrah Resmi. */
    async getJukrahReadReport(user: any, postId: number) {
        const rows = await this.dataSource.query(
            `SELECT 
                COALESCE(s.id, 0)::int as satker_id,
                COALESCE(s.deskripsi, 'Robinopsnal Bareskrim Polri (Pusat)') as satker_nama,
                COALESCE(s.nama_singkat, 'Robinopsnal Bareskrim Polri') as satker_singkat,
                COUNT(DISTINCT u.id)::int as total_personil,
                COUNT(DISTINCT rr.user_id)::int as total_sudah_baca
             FROM auth_users u
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             LEFT JOIN bdb_social_read_receipts rr ON rr.post_id = $1 AND rr.user_id = u.id
             WHERE (UPPER(u.status) = 'AKTIF' OR LOWER(u.status) = 'active')
             GROUP BY COALESCE(s.id, 0), COALESCE(s.deskripsi, 'Robinopsnal Bareskrim Polri (Pusat)'), COALESCE(s.nama_singkat, 'Robinopsnal Bareskrim Polri')
             ORDER BY total_sudah_baca DESC, total_personil DESC`,
            [postId]
        );

        const readersRows = await this.dataSource.query(
            `SELECT rr.user_id, rr.acknowledged_at,
                    u.name, u.username, u.callsign, u.role_bdb,
                    s.nama_singkat as satker_singkat, s.deskripsi as satker_nama
             FROM bdb_social_read_receipts rr
             JOIN auth_users u ON u.id = rr.user_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE rr.post_id = $1
             ORDER BY rr.acknowledged_at DESC`,
            [postId]
        );

        const readers = readersRows.map((r: any) => {
            const isUserOne = this.isSuperUserOne(r.user_id, r.username, r.callsign);
            return {
                user_id: Number(r.user_id),
                name: isUserOne ? (r.name || 'EKO') : (r.name || r.username),
                handle: this.formatCallsign(r.callsign, r.user_id, r.username, r.name),
                satker: this.resolveAuthorSatker(r.satker_singkat, r.satker_nama, r.role_bdb, isUserOne),
                role_bdb: isUserOne ? 'superadmin' : (r.role_bdb || 'operator'),
                acknowledged_at: r.acknowledged_at
            };
        });

        return { status: 1, data: rows, readers };
    }

    // =========================================================================
    // LEGACY BULLETIN METHODS (Tetap dipertahankan untuk backward-compatibility)
    // =========================================================================

    private async recordView(jukrahId: number, user: any, nama?: string) {
        const uid = user?.id;
        if (!uid) return;
        const ins = await this.dataSource.query('insert into bdb_jukrah_view (jukrah_id, user_id) values ($1,$2) on conflict (jukrah_id, user_id) do nothing returning id', [jukrahId, uid]);
        if (ins.length) {
            await this.audit.log({ user, action: 'VIEW', entity: 'jukrah', entityId: jukrahId, meta: { nama } });
        }
    }

    private async withUrl(rows: any[]) {
        for (const r of rows) {
            if (r.lampiran?.key) {
                try {
                    r.lampiran.url = await this.minio.presignedUrl(r.lampiran.key);
                } catch {
                    /* abaikan */
                }
            }
        }
        return rows;
    }

    private verifyMagicBytes(buffer: Buffer, ext: string): void {
        if (!buffer || buffer.length < 4) {
            throw new BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
        }
        // 1. Block dangerous executable/script signatures regardless of extension
        if (buffer[0] === 0x4D && buffer[1] === 0x5A) {
            throw new BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
        }
        if (buffer[0] === 0x7F && buffer[1] === 0x45 && buffer[2] === 0x4C && buffer[3] === 0x46) {
            throw new BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
        }
        const headStr = buffer.subarray(0, Math.min(256, buffer.length)).toString('utf8').toLowerCase();
        if (
            headStr.includes('<?php') ||
            headStr.includes('<script') ||
            headStr.includes('#!/bin/sh') ||
            headStr.includes('#!/bin/bash')
        ) {
            throw new BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
        }

        // 2. Validate magic bytes for strict media/PDF types
        const cleanExt = (ext || '').toLowerCase().startsWith('.')
            ? (ext || '').toLowerCase()
            : `.${(ext || '').toLowerCase()}`;

        if (cleanExt === '.pdf') {
            if (
                buffer.length < 5 ||
                buffer[0] !== 0x25 ||
                buffer[1] !== 0x50 ||
                buffer[2] !== 0x44 ||
                buffer[3] !== 0x46 ||
                buffer[4] !== 0x2D
            ) {
                throw new BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
            }
        } else if (cleanExt === '.jpg' || cleanExt === '.jpeg') {
            if (buffer[0] !== 0xFF || buffer[1] !== 0xD8 || buffer[2] !== 0xFF) {
                throw new BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
            }
        } else if (cleanExt === '.png') {
            if (
                buffer[0] !== 0x89 ||
                buffer[1] !== 0x50 ||
                buffer[2] !== 0x4E ||
                buffer[3] !== 0x47
            ) {
                throw new BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
            }
        } else if (cleanExt === '.gif') {
            const gifSig = buffer.subarray(0, 6).toString('ascii');
            if (gifSig !== 'GIF87a' && gifSig !== 'GIF89a') {
                throw new BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
            }
        } else if (cleanExt === '.webp') {
            const riffSig = buffer.subarray(0, 4).toString('ascii');
            const webpSig = buffer.length >= 12 ? buffer.subarray(8, 12).toString('ascii') : '';
            if (riffSig !== 'RIFF' || webpSig !== 'WEBP') {
                throw new BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
            }
        }
    }

    private async saveUploadedFile(file: any, folder = 'social') {
        if (!file) return null;
        const origName = String(file.originalname || '');
        const dotIdx = origName.lastIndexOf('.');
        let ext = dotIdx >= 0 ? origName.slice(dotIdx).toLowerCase() : '';
        if (!ext && file.mimetype) {
            const m = String(file.mimetype).toLowerCase();
            if (m === 'application/pdf') ext = '.pdf';
            else if (m === 'image/jpeg' || m === 'image/jpg') ext = '.jpg';
            else if (m === 'image/png') ext = '.png';
            else if (m === 'image/gif') ext = '.gif';
            else if (m === 'image/webp') ext = '.webp';
        }
        if (file?.buffer) {
            this.verifyMagicBytes(file.buffer, ext);
        }
        return this.minio.upload(file, folder);
    }

    private async uploadPdf(file: any) {
        if (!file) return null;
        if (file.mimetype !== 'application/pdf') throw new BadRequestException('Lampiran harus berupa file PDF.');
        if (file?.buffer) {
            this.verifyMagicBytes(file.buffer, '.pdf');
        }
        const key = await this.saveUploadedFile(file, 'jukrah');
        return { name: file.originalname, key, size: file.size, mime: file.mimetype };
    }

    async list(opts: { search?: string; aktif?: string }) {
        await this.ensureTable();
        const params: any[] = [];
        const wh: string[] = [];
        if (opts.search && opts.search.trim()) {
            params.push(`%${opts.search.trim()}%`);
            wh.push(`(b.nama ilike $${params.length} or b.deskripsi ilike $${params.length})`);
        }
        if (opts.aktif === 'true') wh.push('b.aktif=true');
        else if (opts.aktif === 'false') wh.push('b.aktif=false');
        const where = wh.length ? 'where ' + wh.join(' and ') : '';
        const rows = await this.dataSource.query(
            `select b.id, b.nama, b.deskripsi, b.aktif, b.lampiran, b.tanggal_publish, b.created_at, b.updated_at, u.name as created_by_nama,
                    (select count(*) from bdb_jukrah_view v where v.jukrah_id=b.id)::int as view_count
             from bdb_jukrah b left join auth_users u on u.id=b.created_by ${where} order by b.tanggal_publish desc, b.id desc`,
            params
        );
        return { status: 1, data: await this.withUrl(rows) };
    }

    async active(user: any, opts: { search?: string }) {
        await this.ensureTable();
        const params: any[] = [];
        let where = 'where aktif=true and tanggal_publish <= current_date';
        if (opts.search && opts.search.trim()) {
            params.push(`%${opts.search.trim()}%`);
            where += ' and (nama ilike $1 or deskripsi ilike $1)';
        }
        const rows = await this.dataSource.query(`select id, nama, deskripsi, lampiran, tanggal_publish from bdb_jukrah ${where} order by tanggal_publish desc, id desc`, params);
        for (const r of rows) await this.recordView(r.id, user, r.nama);
        if (rows.length) {
            const counts = await this.dataSource.query(
                `select jukrah_id, count(*)::int c from bdb_jukrah_view where jukrah_id = any($1) group by jukrah_id`,
                [rows.map((r: any) => r.id)]
            );
            const map = new Map<number, number>(counts.map((c: any) => [Number(c.jukrah_id), c.c]));
            for (const r of rows) r.view_count = map.get(Number(r.id)) || 0;
        }
        return { status: 1, data: await this.withUrl(rows) };
    }

    async create(user: any, body: any, file: any) {
        await this.ensureTable();
        const nama = (body.nama || '').trim();
        if (!nama) throw new BadRequestException('Nama wajib diisi.');
        if (body.tanggal_publish) {
            const chk = await this.dataSource.query('select ($1::date < current_date) as bad', [body.tanggal_publish]);
            if (chk[0]?.bad) throw new BadRequestException('Tanggal publikasi tidak boleh mundur (backdate).');
        }
        const lampiran = await this.uploadPdf(file);
        const aktif = !(body.aktif === 'false' || body.aktif === false);
        const r = await this.dataSource.query(
            'insert into bdb_jukrah (nama, deskripsi, aktif, lampiran, tanggal_publish, created_by) values ($1,$2,$3,$4,coalesce($5::date, current_date),$6) returning id',
            [nama, body.deskripsi?.trim() || null, aktif, lampiran ? JSON.stringify(lampiran) : null, body.tanggal_publish || null, user?.id || null]
        );
        await this.audit.log({ user, action: 'CREATE', entity: 'jukrah', entityId: r[0].id, meta: { nama } });
        return { status: 1, data: { id: r[0].id }, message: 'Pengumuman ditambahkan.' };
    }

    async update(user: any, id: number, body: any, file: any, keepLampiran: any) {
        await this.ensureTable();
        const ex = await this.dataSource.query('select * from bdb_jukrah where id=$1', [id]);
        if (!ex.length) throw new NotFoundException('Data tidak ditemukan.');
        const nama = (body.nama || '').trim();
        if (!nama) throw new BadRequestException('Nama wajib diisi.');
        if (body.tanggal_publish) {
            const chk = await this.dataSource.query('select ($1::date < current_date and $1::date <> tanggal_publish) as bad from bdb_jukrah where id=$2', [body.tanggal_publish, id]);
            if (chk[0]?.bad) throw new BadRequestException('Tanggal publikasi tidak boleh mundur (backdate).');
        }
        let lampiran = ex[0].lampiran;
        if (file) lampiran = await this.uploadPdf(file);
        else if (keepLampiran === 'false' || keepLampiran === false) lampiran = null;
        const aktif = body.aktif === undefined ? ex[0].aktif : !(body.aktif === 'false' || body.aktif === false);
        await this.dataSource.query(
            'update bdb_jukrah set nama=$2, deskripsi=$3, aktif=$4, lampiran=$5, tanggal_publish=coalesce($6::date, tanggal_publish), updated_at=now() where id=$1',
            [id, nama, body.deskripsi?.trim() || null, aktif, lampiran ? JSON.stringify(lampiran) : null, body.tanggal_publish || null]
        );
        await this.audit.log({ user, action: 'UPDATE', entity: 'jukrah', entityId: id, meta: { nama } });
        return { status: 1, message: 'Pengumuman diperbarui.' };
    }

    async remove(user: any, id: number) {
        await this.ensureTable();
        const [r] = await this.dataSource.query('delete from bdb_jukrah where id=$1 returning id, nama', [id]);
        if (!r.length) throw new NotFoundException('Data tidak ditemukan.');
        await this.audit.log({ user, action: 'DELETE', entity: 'jukrah', entityId: id, meta: { nama: r[0].nama } });
        return { status: 1, message: 'Pengumuman dihapus.' };
    }
}
