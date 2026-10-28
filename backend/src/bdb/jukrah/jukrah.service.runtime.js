"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JukrahService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JukrahService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const minio_service_1 = require("../kerma/minio.service");
const audit_service_1 = require("../audit/audit.service");
const crypto = require("crypto");
let JukrahService = class JukrahService {
    static { JukrahService_1 = this; }
    dataSource;
    minio;
    audit;
    logger = new common_1.Logger('JukrahService');
    ready = false;
    streamSecret = process.env.JWT_SECRET || process.env.CAS_STREAM_SECRET || '';
    networkUsersCache = new Map();
    networkCountCache = new Map();
    static NETWORK_CACHE_TTL_MS = 30 * 1000;
    constructor(dataSource, minio, audit) {
        this.dataSource = dataSource;
        this.minio = minio;
        this.audit = audit;
    }
    clearNetworkUsersCache() {
        this.networkUsersCache.clear();
        this.networkCountCache.clear();
    }
    async ensureTable() {
        if (this.ready)
            return;
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
            create table if not exists bdb_social_messages (
                id bigserial primary key,
                sender_id bigint not null,
                receiver_id bigint not null,
                content text not null,
                media_url text,
                is_read boolean not null default false,
                created_at timestamptz not null default now()
            )`);
        try {
            await this.dataSource.query('ALTER TABLE bdb_social_notifications ADD COLUMN IF NOT EXISTS link TEXT');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_social_msg_sender_rec ON bdb_social_messages (sender_id, receiver_id, created_at DESC)');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_social_msg_rec_read ON bdb_social_messages (receiver_id, is_read, created_at DESC)');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_user_conn_req_status ON user_connections (requester_id, status)');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_user_conn_addr_status ON user_connections (addressee_id, status)');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_trb_police_lower_email ON trb_police (LOWER(email))');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_auth_users_status_login ON auth_users (status, last_login_at DESC NULLS LAST, id ASC)');
        }
        catch { }
        await this.ensureMasterUserCallsignSync();
        this.clearNetworkUsersCache();
        this.ready = true;
    }
    async ensureMasterUserCallsignSync() {
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
        }
        catch (err) {
            this.logger.warn('ensureMasterUserCallsignSync warning: ' + (err?.message || err));
        }
    }
    extractTwoWordCallsignFromName(rawName, authorId) {
        if (Number(authorId) === 1)
            return 'om.eko_42';
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
        if (pool.length >= 2)
            return `${pool[0]}.${pool[1]}`.slice(0, 60);
        if (pool.length === 1)
            return pool[0].slice(0, 60);
        return `personil.${String(authorId || '0').replace(/[^0-9]/g, '') || '0'}`;
    }
    isFemalePersonnel(name, jenisKelamin, socialMedia) {
        const explicitJk = String(socialMedia?.jenis_kelamin || socialMedia?.gender || '').trim().toLowerCase();
        if (['p', 'perempuan', 'wanita', 'female', 'f', 'polwan'].includes(explicitJk))
            return true;
        if (['l', 'laki-laki', 'laki', 'pria', 'male', 'm', 'polki'].includes(explicitJk))
            return false;
        const jk = String(jenisKelamin || '').trim().toLowerCase();
        if (['p', 'perempuan', 'wanita', 'female', 'f', 'polwan'].includes(jk))
            return true;
        const n = String(name || '').trim();
        if (!n)
            return false;
        if (/^(doliandri|muhammad|muhamad|mohammad|mohamad|mochamad|mochammad|m\.|moh\.|muh\.|ahmad|achmad|budi|agus|hendra|eko|rizky|rizki|andi|dedi|dedy|wahyu|bayu|dimas|bagus|fajar|reza|ilham|arif|arief|irfan|taufik|taufiq|hidayat|saputra|pratama|dewangga|irwan|iwan|heru|heri|hery|bambang|slamet|joko|tri\s+budi|agung|dwi\s+putra|putra)\b/i.test(n))
            return false;
        return /\b(siti|sri|dewi|dewie|ayu|putri|dian|fitri|fitria|fitriani|nurul|rina|rini|desi|desy|mega|ratna|wulan|wulandari|indah|intan|novita|novi|lestari|anggraini|maharani|puspita|handayani|kusumawati|rahmawati|susanti|astuti|widyastuti|yuliani|yulia|yuni|wahyuni|fatimah|alfia|amini|tita|maria|theresia|veronica|natalia|debora|chintya|nadia|nabila|annisa|anisa|aulia|amelia|amalia|tiara|citra|maya|lina|linda|nina|dina|vina|vera|sari|wati|ningrum|ningsih|pratiwi|yashinta|prameswari|retno|endang|inggrid|ni\s+putu|ni\s+made|ni\s+luh|ni\s+wayan|ni\s+kadek|ni\s+komang|ni\s+nyoman|ni\s+ketut)\b/i.test(n);
    }
    resolveDefaultAvatar(photoUrl, name, jenisKelamin, socialMedia) {
        const clean = String(photoUrl || '').trim();
        if (clean.length > 5 && clean !== 'null' && clean !== 'undefined' && !clean.includes('default-avatar'))
            return clean;
        return this.isFemalePersonnel(name, jenisKelamin, socialMedia)
            ? '/images/default-avatar-polwan.jpg'
            : '/images/default-avatar-polki.png';
    }
    resolveDefaultBanner(socialMedia) {
        const b = typeof socialMedia?.banner_theme === 'string' ? socialMedia.banner_theme.trim() : '';
        if (b && !b.includes('default-banner') && (b.startsWith('data:image') || b.startsWith('http') || b.startsWith('/') || b.startsWith('linear-gradient') || b.startsWith('radial-gradient'))) {
            return b;
        }
        return '/images/default-banner-polri.jpg';
    }
    isSuperUserOne(id, username, callsign) {
        if (Number(id) === 1)
            return true;
        const u = String(username || '').trim().toLowerCase().replace(/^@/, '');
        const c = String(callsign || '').trim().toLowerCase().replace(/^@/, '');
        return u === 'omeko42' || u === 'om.eko_42' || c === 'omeko42' || c === 'om.eko_42';
    }
    resolveAuthorSatker(satkerSingkat, satkerNama, roleBdb, isUserOne) {
        if (isUserOne)
            return 'Robinopsnal Bareskrim Polri';
        const raw = String(satkerSingkat || satkerNama || '').trim();
        const role = String(roleBdb || '').toLowerCase();
        const isGlobal = role === 'superadmin' || role === 'admin_binops';
        const low = raw.toLowerCase();
        if (!raw || low === 'polri' || low === 'mabes polri' || low === 'bareskrim' || low === 'bareskrim polri' || low === 'robinopsnal' || low === 'robinopsnal bareskrim polri') {
            return isGlobal ? 'Robinopsnal Bareskrim Polri' : (raw || 'Bareskrim Polri');
        }
        return raw;
    }
    createPostShareHash(postId) {
        const pid = Number(postId || 0);
        const secret = this.streamSecret || 'cas-sharese-secret-2026';
        const sig = crypto.createHmac('sha256', secret).update(`sharese_post:${pid}`).digest('hex').slice(0, 16);
        return Buffer.from(`sp.${pid}.${sig}`, 'utf8').toString('base64url');
    }
    extractCandidatePostIds(hash) {
        const candidates = [];
        const addCandidate = (n) => {
            if (Number.isInteger(n) && n > 0 && !candidates.includes(n)) {
                candidates.push(n);
            }
        };
        try {
            const clean = String(hash || '').trim();
            if (!clean)
                return candidates;
            const prefixMatch = clean.match(/^(?:sharese|post|sp)[-_:](\d+)$/i);
            if (prefixMatch) {
                addCandidate(parseInt(prefixMatch[1], 10));
            }
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
                }
                else if (/^\d+$/.test(decoded.trim())) {
                    addCandidate(parseInt(decoded.trim(), 10));
                }
            }
            catch { }
            if (/^(?:3[0-9])+$/.test(clean) && clean.length % 2 === 0) {
                try {
                    const hexStr = Buffer.from(clean, 'hex').toString('utf8');
                    if (/^\d+$/.test(hexStr)) {
                        addCandidate(parseInt(hexStr, 10));
                    }
                }
                catch { }
            }
            if (/^[0-9a-z]+$/i.test(clean)) {
                const b36 = parseInt(clean, 36);
                if (!isNaN(b36) && b36 > 104729 && (b36 - 104729) % 7919 === 0) {
                    addCandidate((b36 - 104729) / 7919);
                }
            }
            if (/^\d+$/.test(clean)) {
                addCandidate(parseInt(clean, 10));
            }
        }
        catch { }
        return candidates;
    }
    verifyPostShareHash(hash) {
        const candidates = this.extractCandidatePostIds(hash);
        return candidates.length > 0 ? candidates[0] : null;
    }
    async resolvePostIdFromHash(hash, fallbackPostId) {
        const candidates = this.extractCandidatePostIds(hash);
        if (fallbackPostId && Number.isInteger(Number(fallbackPostId)) && Number(fallbackPostId) > 0 && !candidates.includes(Number(fallbackPostId))) {
            candidates.push(Number(fallbackPostId));
        }
        if (!candidates.length)
            return null;
        try {
            const rows = await this.dataSource.query(`SELECT id FROM bdb_social_posts WHERE id = ANY($1) AND status = 'active'`, [candidates]);
            const activeIds = new Set(rows.map((r) => Number(r.id)));
            for (const cid of candidates) {
                if (activeIds.has(cid))
                    return cid;
            }
        }
        catch { }
        return candidates[0] || null;
    }
    async verifyPersonnelNrp(rawNrp) {
        const clean = String(rawNrp || '').trim().replace(/[\s.-]+/g, '');
        if (!clean) {
            throw new common_1.UnauthorizedException('Verifikasi identitas "Siapa Saya?" (NRP/NIP) wajib disertakan untuk mengakses tautan ini.');
        }
        if (clean.length < 4 || !/^[a-zA-Z0-9@_.-]{4,40}$/.test(clean)) {
            throw new common_1.ForbiddenException('Format NRP / NIP tidak valid.');
        }
        const userRows = await this.dataSource.query(`SELECT
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
             LIMIT 1`, [clean]);
        let found = userRows[0] || null;
        if (!found) {
            const tpRows = await this.dataSource.query(`SELECT
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
                 LIMIT 1`, [clean]);
            found = tpRows[0] || null;
        }
        if (!found) {
            throw new common_1.ForbiddenException('NRP / NIP tidak terdaftar sebagai personel aktif di database CAS Bareskrim Polri.');
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
    async getShareChallenge(shareToken, postId) {
        await this.ensureTable();
        let targetId = Number(postId || 0);
        if (shareToken) {
            const resolved = await this.resolvePostIdFromHash(shareToken, targetId);
            if (!resolved) {
                throw new common_1.BadRequestException('Tautan berhash Sharese tidak valid atau sudah kedaluwarsa.');
            }
            targetId = resolved;
        }
        let postPreview = null;
        if (targetId && !isNaN(targetId) && targetId > 0) {
            const rows = await this.dataSource.query(`SELECT p.id, p.author_id, p.audience_type, p.content, p.media_urls, p.is_official_jukrah, p.is_pinned, p.created_at,
                        u.name as raw_author_name, u.username as author_username, u.callsign as author_callsign, u.role_bdb as author_role,
                        s.deskripsi as author_satker_nama, s.nama_singkat as author_satker_singkat
                 FROM bdb_social_posts p
                 JOIN auth_users u ON u.id = p.author_id
                 LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
                 WHERE p.id = $1 AND p.status = 'active'
                 LIMIT 1`, [targetId]);
            if (!rows.length && shareToken) {
                throw new common_1.NotFoundException('Postingan Sharese tidak ditemukan atau telah ditarik.');
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
    async buildSharedPostPayload(postId, uid) {
        const rows = await this.dataSource.query(`SELECT p.id, p.author_id, p.audience_type, p.target_satker_ids, p.content, p.media_urls, p.case_lp_ids,
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
             LIMIT 1`, [postId]);
        if (!rows.length) {
            throw new common_1.NotFoundException('Postingan Sharese tidak ditemukan atau telah dihapus.');
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
        const media = (r.media_urls || []).map((m) => ({
            ...m,
            stream_url: m.key ? `/api/bdb/sharese/stream/${this.createStreamToken(m.key, m.mime || 'application/octet-stream', uid || 0)}` : null
        }));
        const commentRows = await this.dataSource.query(`SELECT c.id, c.post_id, c.user_id, c.parent_id, c.content, c.likes_count, c.is_edited, c.created_at,
                    u.name as raw_name, u.username, u.callsign, u.role_bdb, u.photo_url, u.social_media,
                    s.nama_singkat as satker_singkat, s.deskripsi as satker_nama
             FROM bdb_social_comments c
             JOIN auth_users u ON u.id = c.user_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC
             LIMIT 50`, [postId]);
        const comments = commentRows.map((c) => {
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
        const docMedia = media.find((m) => m.type === 'document' || (m.mime && m.mime.includes('pdf'))) || null;
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
    async verifyShareViewer(body, meta) {
        await this.ensureTable();
        const challengeToken = String(body?.challenge_token || body?.captcha_token || '').trim();
        const captchaAnswer = String(body?.captcha_answer || body?.captcha_code || body?.captcha || '').trim().toUpperCase();
        const nrpNip = String(body?.nrp_nip || body?.nrp || '').trim();
        if (!nrpNip || nrpNip.length < 4) {
            throw new common_1.BadRequestException('NRP / NIP wajib diisi dengan benar.');
        }
        let verifiedViewer = null;
        try {
            verifiedViewer = await this.verifyPersonnelNrp(nrpNip);
        }
        catch (err) {
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
                throw new common_1.BadRequestException('Kode keamanan Captcha wajib diisi.');
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
                    throw new common_1.BadRequestException('Sesi Captcha telah kedaluwarsa. Silakan muat ulang kode Captcha.');
                }
                const secret = this.streamSecret || 'cas-sharese-secret-2026';
                const expectedSig = crypto.createHmac('sha256', secret).update(`${pidStr}|${ans}|${expStr}`).digest('hex');
                if (sig !== expectedSig) {
                    throw new common_1.BadRequestException('Token keamanan Captcha tidak sah.');
                }
                if (captchaAnswer !== ans.toUpperCase()) {
                    throw new common_1.BadRequestException('Kode Captcha (6 karakter) tidak sesuai. Silakan periksa kembali.');
                }
                targetPostId = parseInt(pidStr, 10) || targetPostId;
            }
            catch (e) {
                if (e instanceof common_1.BadRequestException)
                    throw e;
                throw new common_1.BadRequestException('Verifikasi Captcha gagal. Silakan muat ulang Captcha.');
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
        await this.dataSource.query(`INSERT INTO bdb_social_share_access_log (post_id, jenis_personel, nama, nrp_nip, satker, ip_address, user_agent)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`, [targetPostId, jenisPersonel, nama, verifiedViewer.nrp, satker || '-', meta?.ip || '', meta?.userAgent || '']);
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
    async getPublicSharedPost(idOrHash, rawNrp, authUser, meta) {
        await this.ensureTable();
        const viewer = await this.verifyPersonnelNrp(rawNrp);
        const postId = await this.resolvePostIdFromHash(idOrHash);
        if (!postId) {
            throw new common_1.NotFoundException('Tautan siaran Sharese tidak ditemukan atau tidak valid.');
        }
        const uid = Number(authUser?.id || authUser?.user?.id || viewer.user_id || 0);
        const postData = await this.buildSharedPostPayload(postId, uid);
        await this.dataSource.query(`INSERT INTO bdb_social_share_access_log (post_id, jenis_personel, nama, nrp_nip, satker, ip_address, user_agent)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`, [postId, viewer.jenis_personel, viewer.nama, viewer.nrp, viewer.satker || '-', meta?.ip || '', meta?.userAgent || '']);
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
    async getSharedPost(user, shareToken) {
        await this.ensureTable();
        const postId = await this.resolvePostIdFromHash(shareToken);
        if (!postId) {
            throw new common_1.BadRequestException('Tautan berhash Sharese tidak valid.');
        }
        const uid = Number(user?.id || user?.user?.id || 0);
        const postData = await this.buildSharedPostPayload(postId, uid);
        return {
            status: 1,
            data: postData
        };
    }
    formatCallsign(rawCallsign, authorId, username, authorName) {
        const idStr = String(authorId || '');
        if (idStr === '1' || this.isSuperUserOne(authorId, username, rawCallsign))
            return '@om.eko_42';
        const invalidPlaceholders = new Set(['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse']);
        const normalizeCandidate = (rawVal) => {
            let v = String(rawVal || '').trim().replace(/^@+/, '').toLowerCase();
            if (!v || v.length < 2)
                return '';
            if (invalidPlaceholders.has(v))
                return '';
            if (v.startsWith('pers_') || v.startsWith('user_') || /^\d+$/.test(v))
                return '';
            if (!/^[a-z0-9_.]{2,60}$/.test(v))
                return '';
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
        if (c)
            return '@' + c;
        const u = normalizeCandidate(username);
        if (u)
            return '@' + u;
        if (authorName && String(authorName).trim()) {
            return '@' + this.extractTwoWordCallsignFromName(authorName, authorId);
        }
        return '@personil.' + (idStr.replace(/[^0-9]/g, '') || '0');
    }
    createStreamToken(key, mime, userId) {
        const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const payload = `${key}|${mime}|${userId}|${exp}`;
        const hmac = crypto.createHmac('sha256', this.streamSecret).update(payload).digest('hex');
        const tokenRaw = `${payload}|${hmac}`;
        return Buffer.from(tokenRaw).toString('base64url');
    }
    verifyStreamToken(token) {
        try {
            const raw = Buffer.from(token, 'base64url').toString('utf8');
            const parts = raw.split('|');
            if (parts.length !== 5)
                return null;
            const [key, mime, userIdStr, expStr, sig] = parts;
            const exp = parseInt(expStr, 10);
            if (isNaN(exp) || Date.now() > exp + 7 * 24 * 60 * 60 * 1000)
                return null;
            const payload = `${key}|${mime}|${userIdStr}|${expStr}`;
            const expectedSig = crypto.createHmac('sha256', this.streamSecret).update(payload).digest('hex');
            if (sig !== expectedSig)
                return null;
            return { key, mime, userId: parseInt(userIdStr, 10) };
        }
        catch {
            return null;
        }
    }
    async streamMedia(token, res) {
        const verified = this.verifyStreamToken(token);
        if (!verified) {
            throw new common_1.ForbiddenException('Tautan media kadaluwarsa atau tidak sah (Akses Ditolak).');
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
                }
                else if (verified.key) {
                    dlFilename = verified.key.split('/').pop() || 'berkas-lampiran';
                }
                res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(dlFilename)}"`);
            }
            else {
                res.setHeader('Content-Disposition', 'inline');
            }
            stream.on("error", (err) => { this.logger.error("Stream pipe error: " + (err?.message || err)); if (!res.headersSent) res.status(404).end(); else res.end(); }); stream.pipe(res);
        }
        catch (e) {
            this.logger.error(`Stream error key ${verified.key}: ${e.message}`);
            throw new common_1.NotFoundException('File media tidak ditemukan.');
        }
    }
    async getFeed(user, opts) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const userSatkerId = Number(user?.scope_satker_id || 0);
        const userRole = String(user?.role_bdb || 'sharese').toLowerCase();
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(userRole);
        const page = Math.max(1, Number(opts.page) || 1);
        const limit = Math.min(200, Math.max(1, Number(opts.limit) || 100));
        const offset = (page - 1) * limit;
        const params = [uid, userSatkerId];
        const conditions = ["p.status = 'active'"];
        const audienceFilter = `(
            p.author_id = $1
            OR p.audience_type = 'public'
            OR (p.audience_type = 'regional' AND ($2::int = ANY(p.target_satker_ids) OR p.target_satker_ids = '{}' OR u.scope_satker_id = $2::int OR ${isGlobalAdmin ? 'true' : 'false'}))
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
        }
        else if (effectiveFilter === 'saved' || effectiveFilter === 'bookmarks') {
            conditions.push('bm.id IS NOT NULL');
        }
        else if (effectiveFilter === 'jukrah' || effectiveFilter === 'official') {
            conditions.push('p.is_official_jukrah = true');
        }
        else if (effectiveFilter === 'regional') {
            conditions.push("p.audience_type = 'regional'");
        }
        else if (effectiveFilter === 'friends') {
            conditions.push("p.audience_type = 'friends'");
        }
        else if (effectiveFilter === 'private') {
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
        const posts = rows.map((r) => {
            const isSelf = Number(r.author_id) === uid;
            const isUserOne = this.isSuperUserOne(r.author_id, r.author_username, r.author_callsign);
            const canSeeRealName = isGlobalAdmin || isSelf || isUserOne;
            const nrpMatch = (r.author_email_polri || '').match(/^(\d+)@/);
            const derivedNrp = nrpMatch ? nrpMatch[1] : (r.author_username && r.author_username.replace(/^Nrp\./i, '')) || '';
            const handle = this.formatCallsign(r.author_callsign, r.author_id, r.author_username, r.raw_author_name);
            const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
            const displayName = isUserOne ? (r.raw_author_name || 'EKO') : (canSeeRealName ? (r.raw_author_name || handle) : handle);
            const authorSatker = isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.author_satker_singkat || r.author_satker_nama || 'Polri');
            const isVerified = isUserOne ? true : Boolean(r.author_role && r.author_role !== 'sharese');
            const authorRole = isUserOne ? 'superadmin' : (r.author_role || 'sharese');
            const resolvedPhoto = this.resolveDefaultAvatar(r.author_photo, r.raw_author_name, null, r.author_social_media);
            const media = (r.media_urls || []).map((m) => ({
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
                can_edit: isSelf || isGlobalAdmin,
                can_delete: isSelf || isGlobalAdmin,
                can_modify_visibility: isSelf
            };
        });
        const parentIds = posts.filter(p => p.parent_post_id).map(p => p.parent_post_id);
        if (parentIds.length) {
            const parents = await this.dataSource.query(`SELECT p.id, p.author_id, p.content, p.created_at, u.name as raw_name, u.callsign, u.username, u.role_bdb,
                        s.nama_singkat as satker, s.deskripsi as satker_nama
                 FROM bdb_social_posts p
                 JOIN auth_users u ON u.id = p.author_id
                 LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
                 WHERE p.id = ANY($1)`, [parentIds]);
            const parentMap = new Map(parents.map((p) => {
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
                    post.parent_post = parentMap.get(post.parent_post_id) || null;
                }
            }
        }
        const countRes = await this.dataSource.query('SELECT count(*)::int as total FROM bdb_social_posts p JOIN auth_users u ON u.id = p.author_id LEFT JOIN bdb_social_bookmarks bm ON bm.post_id = p.id AND bm.user_id = $1 ' + whereClause, params);
        const total = Number(countRes[0]?.total || posts.length);
        return { status: 1, data: posts, total, total_pages: Math.ceil(total / limit) || 1, page, limit };
    }
    async createSocialPost(user, dto, files = []) {
        await this.ensureTable();
        const uid = Number(user?.id);
        if (!uid)
            throw new common_1.ForbiddenException('Sesi tidak valid.');
        const content = (dto.content || '').trim();
        if (!content && (!files || !files.length)) {
            throw new common_1.BadRequestException('Konten postingan atau lampiran wajib diisi.');
        }
        if (content.length > 3000) {
            throw new common_1.BadRequestException('Panjang teks postingan maksimal 3.000 karakter.');
        }
        const userRole = String(user?.role_bdb || 'sharese').toLowerCase();
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(userRole);
        const isOfficial = (dto.is_official_jukrah === true || dto.is_official_jukrah === 'true') && isGlobalAdmin;
        const isPinned = (dto.is_pinned === true || dto.is_pinned === 'true') && isGlobalAdmin;
        const audienceType = ['public', 'regional', 'friends', 'private'].includes(dto.audience_type || '')
            ? dto.audience_type
            : 'public';
        let targetSatkers = [];
        if (Array.isArray(dto.target_satker_ids)) {
            targetSatkers = dto.target_satker_ids.map(Number).filter(n => !isNaN(n));
        }
        if (audienceType === 'regional' && targetSatkers.length === 0 && user?.scope_satker_id) {
            targetSatkers = [Number(user.scope_satker_id)];
        }
        let caseLps = [];
        if (Array.isArray(dto.case_lp_ids)) {
            caseLps = dto.case_lp_ids.map(s => String(s).trim()).filter(Boolean);
        }
        const mediaUrls = [];
        for (const file of files || []) {
            const mime = file.mimetype || 'application/octet-stream';
            if (mime === 'application/pdf' && file.size > 1024 * 1024) {
                throw new common_1.BadRequestException(`Dokumen PDF "${file.originalname}" melebihi batas 1 MB.`);
            }
            if (mime.startsWith('video/') && file.size > 15 * 1024 * 1024) {
                throw new common_1.BadRequestException(`Video "${file.originalname}" melebihi batas 15 MB.`);
            }
            if (mime.startsWith('image/') && file.size > 5 * 1024 * 1024) {
                throw new common_1.BadRequestException(`Gambar "${file.originalname}" melebihi batas 5 MB.`);
            }
            const key = await this.saveUploadedFile(file, 'social');
            mediaUrls.push({
                name: file.originalname,
                key,
                size: file.size,
                mime
            });
        }
        const res = await this.dataSource.query(`INSERT INTO bdb_social_posts 
             (author_id, audience_type, target_satker_ids, content, media_urls, case_lp_ids, is_official_jukrah, is_pinned, parent_post_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id`, [
            uid,
            audienceType,
            targetSatkers,
            content,
            JSON.stringify(mediaUrls),
            caseLps,
            isOfficial,
            isPinned,
            dto.parent_post_id ? Number(dto.parent_post_id) : null
        ]);
        const newPostId = Number(res[0].id);
        if (isOfficial) {
            await this.broadcastDinasNotification(newPostId, user, content);
        }
        const mentionMatches = content.match(/@([a-z0-9_.]{3,30})/gi);
        if (mentionMatches && mentionMatches.length) {
            const handles = Array.from(new Set(mentionMatches.map(m => m.slice(1).toLowerCase())));
            try {
                const taggedUsers = await this.dataSource.query('SELECT id, username, callsign FROM auth_users WHERE (lower(username) = ANY($1) OR lower(callsign) = ANY($1)) AND id <> $2', [handles, uid]);
                for (const tu of taggedUsers) {
                    await this.createNotification({
                        recipientId: Number(tu.id),
                        senderId: uid,
                        category: 'social',
                        type: 'mention',
                        postId: newPostId,
                        title: 'Sebutan Baru (Mention)',
                        message: `Seseorang menyebut Anda dalam sebuah postingan: "${content.slice(0, 75)}..."`
                    });
                }
            }
            catch (err) {
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
                    title: 'Postingan Anda Dibagikan',
                    message: `Seseorang membagikan ulang (repost) postingan Anda.`
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
        return { status: 1, message: 'Postingan berhasil diterbitkan.', data: { id: newPostId } };
    }
    async reactPost(user, postId, reactionType) {
        const uid = Number(user?.id);
        const validTypes = ['like', 'respect', 'insightful', 'applause', 'fire'];
        const type = validTypes.includes(reactionType) ? reactionType : 'like';
        const post = await this.dataSource.query('SELECT id, author_id, reaction_counts FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!post.length)
            throw new common_1.NotFoundException('Postingan tidak ditemukan.');
        const ex = await this.dataSource.query('SELECT reaction_type FROM bdb_social_reactions WHERE post_id = $1 AND user_id = $2', [postId, uid]);
        let currentReaction = null;
        if (ex.length) {
            if (ex[0].reaction_type === type) {
                await this.dataSource.query('DELETE FROM bdb_social_reactions WHERE post_id = $1 AND user_id = $2', [postId, uid]);
            }
            else {
                await this.dataSource.query('UPDATE bdb_social_reactions SET reaction_type = $3 WHERE post_id = $1 AND user_id = $2', [postId, uid, type]);
                currentReaction = type;
            }
        }
        else {
            await this.dataSource.query('INSERT INTO bdb_social_reactions (post_id, user_id, reaction_type) VALUES ($1, $2, $3)', [postId, uid, type]);
            currentReaction = type;
            if (Number(post[0].author_id) !== uid) {
                const rxLabel = type === 'respect' ? 'menghormati (respect)' : type === 'insightful' ? 'mengapresiasi wawasan' : 'menyukai';
                await this.createNotification({
                    recipientId: Number(post[0].author_id),
                    senderId: uid,
                    category: 'social',
                    type: 'reaction',
                    postId,
                    title: 'Reaksi Baru',
                    message: `Seseorang ${rxLabel} postingan Anda.`
                });
            }
        }
        const counts = await this.dataSource.query('SELECT reaction_type, count(*)::int as c FROM bdb_social_reactions WHERE post_id = $1 GROUP BY reaction_type', [postId]);
        const newCounts = { like: 0, respect: 0, insightful: 0, applause: 0, fire: 0 };
        let total = 0;
        counts.forEach((c) => {
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
    async getPostReactions(user, postId) {
        const rows = await this.dataSource.query(`SELECT r.id, r.reaction_type, r.created_at,
                    u.id as user_id, u.name, u.username, u.callsign, u.photo_url, u.role_bdb, u.social_media,
                    s.nama_singkat as satker, s.deskripsi as satker_nama,
                    p.pangkat, p.nrp, p.jenis_kelamin, p.foto
             FROM bdb_social_reactions r
             JOIN auth_users u ON u.id = r.user_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             LEFT JOIN trb_police p ON (lower(p.email) = lower(u.email) OR (u.email_polri IS NOT NULL AND lower(p.email) = lower(u.email_polri)))
             WHERE r.post_id = $1
             ORDER BY r.created_at DESC`, [postId]);
        const list = rows.map((r) => {
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
    async getReactions(user, postId) {
        return this.getPostReactions(user, postId);
    }
    async toggleBookmark(user, postId) {
        const uid = Number(user?.id);
        if (!uid)
            throw new common_1.ForbiddenException('Sesi tidak valid');
        const ex = await this.dataSource.query('SELECT id FROM bdb_social_bookmarks WHERE post_id = $1 AND user_id = $2', [postId, uid]);
        let bookmarked = false;
        if (ex.length) {
            await this.dataSource.query('DELETE FROM bdb_social_bookmarks WHERE post_id = $1 AND user_id = $2', [postId, uid]);
            bookmarked = false;
        }
        else {
            await this.dataSource.query('INSERT INTO bdb_social_bookmarks (post_id, user_id, created_at) VALUES ($1, $2, now()) ON CONFLICT DO NOTHING', [postId, uid]);
            bookmarked = true;
        }
        return {
            status: 1,
            message: bookmarked ? 'Postingan disimpan.' : 'Postingan dihapus dari simpanan.',
            data: { bookmarked, is_bookmarked: bookmarked, post_id: postId }
        };
    }
    async editPost(user, postId, dto) {
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        const post = await this.dataSource.query('SELECT id, author_id FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!post.length)
            throw new common_1.NotFoundException('Postingan tidak ditemukan.');
        if (!isGlobalAdmin && Number(post[0].author_id) !== uid) {
            throw new common_1.ForbiddenException('Hanya pembuat postingan atau admin yang dapat mengedit postingan.');
        }
        const text = (dto.content || '').trim();
        if (!text)
            throw new common_1.BadRequestException('Konten postingan tidak boleh kosong.');
        if (text.length > 3000)
            throw new common_1.BadRequestException('Maksimal 3.000 karakter.');
        const aud = dto.audience_type && ['public', 'regional', 'friends', 'private'].includes(dto.audience_type)
            ? dto.audience_type
            : undefined;
        let updateQuery = 'UPDATE bdb_social_posts SET content = $1, is_edited = true, updated_at = NOW()';
        const params = [text];
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
    async repostPost(user, postId, content) {
        const uid = Number(user?.id);
        const original = await this.dataSource.query("SELECT * FROM bdb_social_posts WHERE id = $1 AND status = 'active'", [postId]);
        if (!original.length)
            throw new common_1.NotFoundException('Postingan asal tidak ditemukan.');
        await this.dataSource.query('UPDATE bdb_social_posts SET repost_count = repost_count + 1 WHERE id = $1', [postId]);
        const postText = (content || '').trim() || `🔁 Meneruskan postingan #${postId}`;
        const newPost = await this.dataSource.query(`INSERT INTO bdb_social_posts (author_id, audience_type, target_satker_ids, content, media_urls, case_lp_ids, reaction_counts, is_official_jukrah, parent_post_id, status, created_at, updated_at)
             VALUES ($1, 'public', '{}', $2, '[]', '{}', '{"like":0,"respect":0,"insightful":0,"applause":0,"fire":0}', false, $3, 'active', now(), now())
             RETURNING id, created_at`, [uid, postText, postId]);
        return { status: 1, message: 'Postingan berhasil diteruskan.', data: { id: Number(newPost[0].id) } };
    }
    async getNetworkUsers(user, opts) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const isSuperadmin = String(user?.role_bdb || '').toLowerCase() === 'superadmin';
        const page = Math.max(1, Number(opts.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(opts.limit) || 30));
        const offset = (page - 1) * limit;
        const search = (opts.search || '').trim();
        const satkerId = opts.satker_id ? String(opts.satker_id).trim() : '';
        let rawConn = opts.connected_to;
        if (rawConn === 'undefined' || rawConn === 'null' || rawConn === '')
            rawConn = null;
        let connectedTo = (rawConn && !isNaN(Number(rawConn))) ? Number(rawConn) : null;
        if (!connectedTo && (opts.filter === 'connected' || opts.satker === 'connected')) {
            connectedTo = Number(opts.target_user_id) || uid;
        }
        const now = Date.now();
        const filterKey = `${connectedTo || 0}|${satkerId}|${search.toLowerCase()}`;
        const pageCacheKey = `${uid}|${isSuperadmin ? 1 : 0}|${filterKey}|${page}|${limit}`;
        const cachedPage = this.networkUsersCache.get(pageCacheKey);
        if (cachedPage && cachedPage.exp > now) {
            return cachedPage.value;
        }
        const whereClauses = ["(u.status = 'AKTIF' OR u.status = 'active')"];
        const params = [];
        if (search) {
            params.push('%' + search + '%');
            const sIdx = params.length;
            whereClauses.push(`(u.name ILIKE $${sIdx} OR u.username ILIKE $${sIdx} OR u.callsign ILIKE $${sIdx} OR u.email_polri ILIKE $${sIdx} OR u.scope_satker_id IN (SELECT id FROM bdb_satker WHERE deskripsi ILIKE $${sIdx} OR nama_singkat ILIKE $${sIdx}))`);
        }
        if (satkerId) {
            params.push(satkerId);
            whereClauses.push('u.scope_satker_id = $' + params.length);
        }
        if (connectedTo) {
            params.push(connectedTo);
            const cIdx = params.length;
            whereClauses.push(`u.id IN (SELECT addressee_id FROM user_connections WHERE requester_id = $${cIdx} AND status = 'ACCEPTED' UNION SELECT requester_id FROM user_connections WHERE addressee_id = $${cIdx} AND status = 'ACCEPTED')`);
        }
        const whereSql = whereClauses.join(' AND ');
        const filterParams = [...params];
        params.push(limit);
        const limitIdx = params.length;
        params.push(offset);
        const offsetIdx = params.length;
        const cachedCount = this.networkCountCache.get(filterKey);
        const hasValidCachedCount = Boolean(cachedCount && cachedCount.exp > now);
        const countWindowSelect = hasValidCachedCount ? '' : ', COUNT(*) OVER()::int as total_count';
        const dataSql = `
            WITH paged_users AS MATERIALIZED (
                SELECT u.id, u.name, u.username, u.callsign, u.email, u.email_polri, u.role_bdb, u.photo_url, u.social_media, u.last_login_at, u.scope_satker_id, u.scope_satker_key${countWindowSelect}
                FROM auth_users u
                WHERE ${whereSql}
                ORDER BY (u.id = 1) DESC, u.last_login_at DESC NULLS LAST, u.id ASC
                LIMIT $${limitIdx} OFFSET $${offsetIdx}
            )
            SELECT pu.*, s.deskripsi as satker_nama, s.nama_singkat as satker_singkat, tp.pangkat, tp.nrp, tp.satuan, tp.no_hp, tp.jenis_kelamin, tp.foto as police_foto
            FROM paged_users pu
            LEFT JOIN bdb_satker s ON s.id = pu.scope_satker_id
            LEFT JOIN LATERAL (
                SELECT pangkat, nrp, satuan, no_hp, jenis_kelamin, foto
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
            total = cachedCount.total;
        }
        else if (rows.length > 0 && rows[0].total_count !== undefined) {
            total = Number(rows[0].total_count || 0);
            this.networkCountCache.set(filterKey, { exp: Date.now() + JukrahService_1.NETWORK_CACHE_TTL_MS, total });
        }
        else if (offset > 0) {
            const cRes = await this.dataSource.query(`SELECT count(*)::int as total FROM auth_users u WHERE ${whereSql}`, filterParams);
            total = Number(cRes[0]?.total || 0);
            this.networkCountCache.set(filterKey, { exp: Date.now() + JukrahService_1.NETWORK_CACHE_TTL_MS, total });
        }
        else {
            this.networkCountCache.set(filterKey, { exp: Date.now() + JukrahService_1.NETWORK_CACHE_TTL_MS, total: 0 });
        }
        let myConnectedIds = new Set();
        let myPendingSentIds = new Set();
        let myPendingReceivedIds = new Set();
        if (uid > 0) {
            try {
                const connRows = await this.dataSource.query(
                    `SELECT requester_id, addressee_id, status FROM user_connections WHERE requester_id = $1 OR addressee_id = $1`,
                    [uid]
                );
                for (const cr of connRows) {
                    const reqId = Number(cr.requester_id);
                    const addrId = Number(cr.addressee_id);
                    const otherId = reqId === uid ? addrId : reqId;
                    if (cr.status === 'ACCEPTED') {
                        myConnectedIds.add(otherId);
                    }
                    else if (cr.status === 'PENDING') {
                        if (reqId === uid)
                            myPendingSentIds.add(otherId);
                        else
                            myPendingReceivedIds.add(otherId);
                    }
                }
            }
            catch { }
        }
        const data = rows.map((r) => {
            const rowUid = Number(r.id);
            const isUserOne = this.isSuperUserOne(r.id, r.username, r.callsign);
            const nrpFallback = r.email && r.email.match(/^(\d{7,10})@/) ? r.email.match(/^(\d{7,10})@/)[1] : (r.email_polri && r.email_polri.match(/^(\d{7,10})@/) ? r.email_polri.match(/^(\d{7,10})@/)[1] : null);
            const satkerSpecific = isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_singkat || r.satker_nama || r.satuan || 'Polri');
            const isFemale = this.isFemalePersonnel(r.name, r.jenis_kelamin, r.social_media);
            const resolvedPhoto = this.resolveDefaultAvatar(r.photo_url || r.police_foto, r.name, r.jenis_kelamin, r.social_media);
            const resolvedHandle = this.formatCallsign(r.callsign || r.username, r.id, r.username, r.name).replace(/^@/, '');
            const isExplicitlyConnected = myConnectedIds.has(rowUid) || Boolean(connectedTo);
            const connStatus = isExplicitlyConnected ? 'ACCEPTED' : (myPendingSentIds.has(rowUid) ? 'PENDING_SENT' : (myPendingReceivedIds.has(rowUid) ? 'PENDING_RECEIVED' : 'NONE'));
            return {
                id: rowUid,
                name: isUserOne ? (r.name || 'EKO') : r.name,
                callsign: resolvedHandle,
                username: resolvedHandle,
                email: r.email,
                email_polri: r.email_polri || (r.email && r.email.endsWith('@polri.go.id') ? r.email : null),
                role_bdb: isUserOne ? 'superadmin' : r.role_bdb,
                satker: satkerSpecific,
                satker_nama: isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_nama || r.satker_singkat || r.satuan || 'Polri'),
                satker_singkat: satkerSpecific,
                scope_satker_name: satkerSpecific,
                pangkat: r.pangkat || (isUserOne ? 'KOMPOL' : (['superadmin', 'admin_binops'].includes(String(r.role_bdb || '').toLowerCase()) ? 'Superadmin' : 'Personil Polri')),
                nrp: r.nrp || nrpFallback,
                no_hp: r.no_hp || null,
                photo_url: resolvedPhoto,
                gender: isFemale ? 'P' : 'L',
                jenis_kelamin: isFemale ? 'P' : 'L',
                is_connected: isExplicitlyConnected || isSuperadmin || rowUid === uid,
                is_following: isExplicitlyConnected,
                connection_status: connStatus,
                last_login_at: r.last_login_at
            };
        });
        const result = { status: 1, data, total, total_pages: Math.ceil(total / limit) || 1, page, limit, is_superadmin: isSuperadmin };
        if (this.networkUsersCache.size > 200) {
            for (const [k, v] of this.networkUsersCache.entries()) {
                if (v.exp <= now)
                    this.networkUsersCache.delete(k);
            }
        }
        this.networkUsersCache.set(pageCacheKey, { exp: Date.now() + JukrahService_1.NETWORK_CACHE_TTL_MS, value: result });
        return result;
    }
    async getNetworkProfile(user, targetId) {
        await this.ensureTable();
        const cleanTarget = String(targetId || '').replace(/^@/, '').trim();
        let targetUid = null;
        if (/^\d+$/.test(cleanTarget)) {
            targetUid = Number(cleanTarget);
        }
        else if (/^user_(\d+)/i.test(cleanTarget)) {
            const m = cleanTarget.match(/^user_(\d+)/i);
            if (m)
                targetUid = Number(m[1]);
        }
        let sql = 'SELECT u.id, u.name, u.username, u.callsign, u.email, u.email_polri, u.role_bdb, u.photo_url, u.status, u.last_login_at, u.social_media, u.scope_satker_id, u.scope_satker_key, s.nama_singkat as satker_singkat, s.deskripsi as satker_nama FROM auth_users u LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id ';
        let params = [];
        if (targetUid) {
            sql += 'WHERE u.id = $1 LIMIT 1';
            params = [targetUid];
        }
        else {
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
        if (!uRes || !uRes.length)
            throw new common_1.NotFoundException('Personil tidak ditemukan');
        const target = uRes[0];
        const isUserOne = this.isSuperUserOne(target.id, target.username, target.callsign);
        let policeProfile = null;
        let connectionsCount = 0;
        try {
            const emailsLower = [target.email, target.email_polri].filter(Boolean).map((e) => String(e).toLowerCase());
            if (emailsLower.length) {
                const pRes = await this.dataSource.query('SELECT nrp, nama, jenis_kelamin, satuan, no_hp, pangkat, jabatan, foto, is_pns, social_media FROM trb_police WHERE lower(email) = any($1::text[]) LIMIT 1', [emailsLower]);
                if (pRes && pRes.length)
                    policeProfile = pRes[0];
            }
        }
        catch { }
        try {
            const cRes = await this.dataSource.query("SELECT count(*)::int as c FROM (SELECT addressee_id FROM user_connections WHERE requester_id = $1 AND status = 'ACCEPTED' UNION SELECT requester_id FROM user_connections WHERE addressee_id = $1 AND status = 'ACCEPTED') conn", [Number(target.id)]);
            connectionsCount = Number(cRes[0]?.c || 0);
        }
        catch { }
        const satkerSpecific = isUserOne ? 'Robinopsnal Bareskrim Polri' : (target.satker_singkat || target.satker_nama || policeProfile?.satuan || 'Polri');
        const pSoc = (policeProfile?.social_media && typeof policeProfile.social_media === 'object') ? policeProfile.social_media : {};
        const uSoc = (target.social_media && typeof target.social_media === 'object') ? target.social_media : {};
        const rawSocial = { ...pSoc, ...uSoc };
        const isCustomBanner = (val) => typeof val === 'string' && val.trim().length > 5 && !val.includes('default-banner');
        if (isCustomBanner(uSoc.banner_theme)) rawSocial.banner_theme = uSoc.banner_theme.trim();
        else if (isCustomBanner(pSoc.banner_theme)) rawSocial.banner_theme = pSoc.banner_theme.trim();
        const resolvedBanner = this.resolveDefaultBanner(rawSocial);
        const isCustomPhoto = (val) => typeof val === 'string' && val.trim().length > 5 && val !== 'null' && val !== 'undefined' && !val.includes('default-avatar');
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
        let isConnectedWithViewer = false;
        let connStatusWithViewer = 'NONE';
        let postsCount = 0;
        const viewerUid = Number(user?.id || 0);
        try {
            const pCountRes = await this.dataSource.query("SELECT count(*)::int as c FROM bdb_social_posts WHERE author_id = $1 AND status = 'active'", [Number(target.id)]);
            postsCount = Number(pCountRes[0]?.c || 0);
        }
        catch { }
        if (viewerUid > 0 && viewerUid !== Number(target.id)) {
            try {
                const vcRes = await this.dataSource.query(
                    `SELECT requester_id, addressee_id, status FROM user_connections WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1) LIMIT 1`,
                    [viewerUid, Number(target.id)]
                );
                if (vcRes.length) {
                    if (vcRes[0].status === 'ACCEPTED') {
                        isConnectedWithViewer = true;
                        connStatusWithViewer = 'ACCEPTED';
                    }
                    else if (vcRes[0].status === 'PENDING') {
                        connStatusWithViewer = Number(vcRes[0].requester_id) === viewerUid ? 'PENDING_SENT' : 'PENDING_RECEIVED';
                    }
                }
            }
            catch { }
        }
        return {
            status: 1,
            data: {
                id: Number(target.id),
                name: isUserOne ? (target.name || 'EKO') : target.name,
                username: resolvedHandle,
                callsign: resolvedHandle,
                nrp: policeProfile?.nrp || (target.email && target.email.match(/^(\d{7,10})@/) ? target.email.match(/^(\d{7,10})@/)[1] : (target.email_polri && target.email_polri.match(/^(\d{7,10})@/) ? target.email_polri.match(/^(\d{7,10})@/)[1] : null)),
                pangkat: policeProfile?.pangkat || (isUserOne ? 'KOMPOL' : (['superadmin', 'admin_binops'].includes(String(target.role_bdb || '').toLowerCase()) ? 'Superadmin' : 'Personil Polri')),
                jabatan: policeProfile?.jabatan || (isUserOne ? 'Kasubdit' : target.role_bdb),
                satuan: isUserOne ? 'Robinopsnal Bareskrim Polri' : (policeProfile?.satuan || target.satker_nama || target.satker_singkat || 'Polri'),
                satker: satkerSpecific,
                satker_nama: isUserOne ? 'Robinopsnal Bareskrim Polri' : (target.satker_nama || target.satker_singkat || 'Polri'),
                scope_satker_name: satkerSpecific,
                email_polri: target.email_polri || (target.email && target.email.endsWith('@polri.go.id') ? target.email : null),
                email: target.email,
                no_hp: policeProfile?.no_hp || null,
                photo_url: resolvedPhoto,
                banner_theme: resolvedBanner,
                gender: isFemale ? 'P' : 'L',
                jenis_kelamin: isFemale ? 'P' : 'L',
                role_bdb: isUserOne ? 'superadmin' : target.role_bdb,
                connections_count: connectionsCount,
                posts_count: postsCount,
                is_connected: isConnectedWithViewer,
                is_following: isConnectedWithViewer,
                connection_status: connStatusWithViewer,
                social_media: mergedSocial,
                last_login_at: target.last_login_at
            }
        };
    }
    async connectNetworkUser(user, targetId) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const tid = Number(targetId || 0);
        if (!uid)
            throw new common_1.ForbiddenException('Sesi tidak valid.');
        if (!tid || tid === uid)
            throw new common_1.BadRequestException('Target koneksi tidak valid.');
        const existing = await this.dataSource.query(
            `SELECT id, requester_id, addressee_id, status FROM user_connections WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1) LIMIT 1`,
            [uid, tid]
        );
        if (existing.length) {
            await this.dataSource.query(`UPDATE user_connections SET status = 'ACCEPTED', updated_at = NOW() WHERE id = $1`, [existing[0].id]);
        }
        else {
            await this.dataSource.query(
                `INSERT INTO user_connections (requester_id, addressee_id, status, created_at, updated_at) VALUES ($1, $2, 'ACCEPTED', NOW(), NOW())`,
                [uid, tid]
            );
        }
        this.clearNetworkUsersCache();
        await this.createNotification({
            recipientId: tid,
            senderId: uid,
            category: 'social',
            type: 'connection',
            title: 'Jejaring Personil Baru',
            message: `Terhubung dengan akun Anda di Jejaring Koneksi Sharese.`,
            link: `/cms/broadcaster?view=koneksi&profileId=${uid}`
        });
        return {
            status: 1,
            message: 'Berhasil terhubung dengan personil.',
            data: { target_id: tid, is_connected: true, is_following: true, connection_status: 'ACCEPTED' }
        };
    }
    async disconnectNetworkUser(user, targetId) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const tid = Number(targetId || 0);
        if (!uid)
            throw new common_1.ForbiddenException('Sesi tidak valid.');
        if (!tid || tid === uid)
            throw new common_1.BadRequestException('Target koneksi tidak valid.');
        await this.dataSource.query(
            `DELETE FROM user_connections WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)`,
            [uid, tid]
        );
        this.clearNetworkUsersCache();
        return {
            status: 1,
            message: 'Koneksi personil telah diputuskan.',
            data: { target_id: tid, is_connected: false, is_following: false, connection_status: 'NONE' }
        };
    }
    async toggleFollowUser(user, targetId) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const tid = Number(targetId || 0);
        if (!uid)
            throw new common_1.ForbiddenException('Sesi tidak valid.');
        if (!tid || tid === uid)
            throw new common_1.BadRequestException('Target personil tidak valid.');
        const existing = await this.dataSource.query(
            `SELECT id, status FROM user_connections WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1) LIMIT 1`,
            [uid, tid]
        );
        if (existing.length && existing[0].status === 'ACCEPTED') {
            return this.disconnectNetworkUser(user, tid);
        }
        return this.connectNetworkUser(user, tid);
    }
    async getComments(user, postId) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        const rows = await this.dataSource.query(`SELECT c.id, c.parent_id, c.content, c.created_at, c.is_edited, c.updated_at,
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
             ORDER BY c.created_at ASC`, [postId, uid]);
        const comments = rows.map((r) => {
            const isSelf = Number(r.author_id) === uid;
            const isUserOne = this.isSuperUserOne(r.author_id, r.username, r.callsign);
            const canSeeReal = isGlobalAdmin || isSelf || isUserOne;
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
                can_edit: isSelf || isGlobalAdmin,
                can_delete: isSelf || Number(r.post_author_id) === uid || isGlobalAdmin
            };
        });
        return { status: 1, data: comments };
    }
    async addComment(user, postId, content, parentId) {
        await this.ensureTable();
        const uid = Number(user?.id);
        const text = (content || '').trim();
        if (!text)
            throw new common_1.BadRequestException('Komentar tidak boleh kosong.');
        if (text.length > 1000)
            throw new common_1.BadRequestException('Panjang teks komentar maksimal 1.000 karakter.');
        const post = await this.dataSource.query('SELECT author_id FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!post.length)
            throw new common_1.NotFoundException('Postingan tidak ditemukan.');
        const r = await this.dataSource.query('INSERT INTO bdb_social_comments (post_id, user_id, parent_id, content) VALUES ($1, $2, $3, $4) RETURNING id, created_at', [postId, uid, parentId ? Number(parentId) : null, text]);
        const cMentionMatches = text.match(/@([a-z0-9_.]{3,30})/gi);
        if (cMentionMatches && cMentionMatches.length) {
            const cHandles = Array.from(new Set(cMentionMatches.map(m => m.slice(1).toLowerCase())));
            try {
                const cTaggedUsers = await this.dataSource.query('SELECT id, username, callsign FROM auth_users WHERE (lower(username) = ANY($1) OR lower(callsign) = ANY($1)) AND id <> $2', [cHandles, uid]);
                for (const tu of cTaggedUsers) {
                    await this.createNotification({
                        recipientId: Number(tu.id),
                        senderId: uid,
                        category: 'social',
                        type: 'mention',
                        postId,
                        title: 'Sebutan Baru di Komentar',
                        message: `Seseorang menyebut Anda dalam sebuah komentar: "${text.slice(0, 75)}..."`
                    });
                }
            }
            catch (err) {
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
                title: 'Komentar Baru',
                message: `Seseorang mengomentari postingan Anda.`
            });
        }
        const uRows = await this.dataSource.query(`SELECT u.id, u.name, u.username, u.callsign, u.role_bdb, u.photo_url, u.social_media,
                    s.nama_singkat as satker, s.deskripsi as satker_nama
             FROM auth_users u
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE u.id = $1`, [uid]);
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
    async editComment(user, commentId, content) {
        await this.ensureTable();
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        const com = await this.dataSource.query('SELECT id, user_id, post_id FROM bdb_social_comments WHERE id = $1', [commentId]);
        if (!com.length)
            throw new common_1.NotFoundException('Komentar tidak ditemukan.');
        if (Number(com[0].user_id) !== uid && !isGlobalAdmin) {
            throw new common_1.ForbiddenException('Anda tidak memiliki izin mengedit komentar ini.');
        }
        const text = (content || '').trim();
        if (!text)
            throw new common_1.BadRequestException('Komentar tidak boleh kosong.');
        if (text.length > 1000)
            throw new common_1.BadRequestException('Panjang teks komentar maksimal 1.000 karakter.');
        await this.dataSource.query('UPDATE bdb_social_comments SET content = $1, is_edited = true, updated_at = NOW() WHERE id = $2', [text, commentId]);
        return {
            status: 1,
            message: 'Komentar berhasil diperbarui.',
            data: { id: commentId, content: text, is_edited: true }
        };
    }
    async reactComment(user, commentId) {
        await this.ensureTable();
        const uid = Number(user?.id);
        if (!uid)
            throw new common_1.ForbiddenException('Sesi tidak valid.');
        const com = await this.dataSource.query('SELECT id, user_id, post_id FROM bdb_social_comments WHERE id = $1', [commentId]);
        if (!com.length)
            throw new common_1.NotFoundException('Komentar tidak ditemukan.');
        const ex = await this.dataSource.query('SELECT 1 FROM bdb_social_comment_reactions WHERE comment_id = $1 AND user_id = $2', [commentId, uid]);
        let liked = false;
        if (ex.length) {
            await this.dataSource.query('DELETE FROM bdb_social_comment_reactions WHERE comment_id = $1 AND user_id = $2', [commentId, uid]);
            liked = false;
        }
        else {
            await this.dataSource.query('INSERT INTO bdb_social_comment_reactions (comment_id, user_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING', [commentId, uid]);
            liked = true;
        }
        const countRes = await this.dataSource.query('SELECT COUNT(*)::int as c FROM bdb_social_comment_reactions WHERE comment_id = $1', [commentId]);
        const count = Number(countRes[0]?.c || 0);
        return {
            status: 1,
            data: { id: commentId, is_liked: liked, likes_count: count }
        };
    }
    async deleteComment(user, commentId) {
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        const com = await this.dataSource.query(`SELECT c.id, c.user_id, p.author_id as post_author_id 
             FROM bdb_social_comments c 
             JOIN bdb_social_posts p ON p.id = c.post_id 
             WHERE c.id = $1`, [commentId]);
        if (!com.length)
            throw new common_1.NotFoundException('Komentar tidak ditemukan.');
        const isCommentAuthor = Number(com[0].user_id) === uid;
        const isPostAuthor = Number(com[0].post_author_id) === uid;
        if (!isCommentAuthor && !isPostAuthor && !isGlobalAdmin) {
            throw new common_1.ForbiddenException('Anda tidak memiliki izin menghapus komentar ini.');
        }
        await this.dataSource.query('DELETE FROM bdb_social_comments WHERE id = $1', [commentId]);
        return { status: 1, message: 'Komentar berhasil dihapus.' };
    }
    async acknowledgePost(user, postId) {
        const uid = Number(user?.id);
        const satkerId = Number(user?.scope_satker_id || 0);
        await this.dataSource.query(`INSERT INTO bdb_social_read_receipts (post_id, satker_id, user_id, acknowledged_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (post_id, user_id) DO NOTHING`, [postId, satkerId, uid]);
        await this.dataSource.query('UPDATE bdb_social_posts SET view_count = coalesce(view_count, 0) + 1 WHERE id = $1', [postId]);
        const countRes = await this.dataSource.query('SELECT COUNT(*)::int as c FROM bdb_social_read_receipts WHERE post_id = $1', [postId]);
        return {
            status: 1,
            message: 'Konfirmasi keterbacaan tercatat.',
            data: { acknowledged: true, acknowledged_count: Number(countRes[0].c) }
        };
    }
    async updateVisibility(user, postId, audienceType) {
        const uid = Number(user?.id);
        const valid = ['public', 'regional', 'friends', 'private'];
        if (!valid.includes(audienceType))
            throw new common_1.BadRequestException('Tipe audiens tidak valid.');
        const ex = await this.dataSource.query('SELECT author_id FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!ex.length)
            throw new common_1.NotFoundException('Postingan tidak ditemukan.');
        if (Number(ex[0].author_id) !== uid) {
            throw new common_1.ForbiddenException('Hanya pembuat postingan yang dapat mengubah visibilitas.');
        }
        await this.dataSource.query('UPDATE bdb_social_posts SET audience_type = $2, updated_at = NOW() WHERE id = $1', [postId, audienceType]);
        return { status: 1, message: `Visibilitas diubah menjadi "${audienceType}".` };
    }
    async deletePost(user, postId) {
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        const ex = await this.dataSource.query('SELECT author_id FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!ex.length)
            throw new common_1.NotFoundException('Postingan tidak ditemukan.');
        if (Number(ex[0].author_id) !== uid && !isGlobalAdmin) {
            throw new common_1.ForbiddenException('Hanya pembuat postingan atau admin yang berhak menghapus.');
        }
        await this.dataSource.query("UPDATE bdb_social_posts SET status = 'deleted', updated_at = NOW() WHERE id = $1", [postId]);
        await this.audit.log({ user, action: 'DELETE', entity: 'social_post', entityId: postId });
        return { status: 1, message: 'Postingan telah dihapus.' };
    }
    async reportPost(user, postId, reason) {
        const uid = Number(user?.id);
        const post = await this.dataSource.query('SELECT id, author_id, content FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!post.length)
            throw new common_1.NotFoundException('Postingan tidak ditemukan.');
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
    async panicTakedown(user, postId) {
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        if (!isGlobalAdmin)
            throw new common_1.ForbiddenException('Akses ditolak.');
        await this.dataSource.query("UPDATE bdb_social_posts SET status = 'quarantined', updated_at = NOW() WHERE id = $1", [postId]);
        await this.audit.log({ user, action: 'TAKEDOWN', entity: 'social_post', entityId: postId, meta: { reason: 'PANIC_TAKEDOWN' } });
        return { status: 1, message: 'Postingan berhasil ditarik dan dikarantina dari linimasa.' };
    }
    async createNotification(data) {
        try {
            await this.ensureTable();
            await this.dataSource.query(`INSERT INTO bdb_social_notifications (recipient_id, sender_id, category, type, post_id, title, message, link)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [data.recipientId, data.senderId, data.category, data.type, data.postId || null, data.title, data.message, data.link || null]);
        }
        catch (e) {
            this.logger.error(`Gagal membuat notifikasi: ${e.message}`);
        }
    }
    async broadcastDinasNotification(postId, authorUser, content) {
        const snippet = content.length > 70 ? content.slice(0, 70) + '...' : content;
        await this.dataSource.query(`INSERT INTO bdb_social_notifications (recipient_id, sender_id, category, type, post_id, title, message)
             SELECT id, $1, 'dinas', 'official_broadcast', $2, '📢 Jukrah Resmi Kedinasan Baru', $3
             FROM auth_users
             WHERE id <> $1 AND status = 'active'
             LIMIT 5000`, [authorUser.id, postId, snippet]);
    }
    async getNotifications(user, category) {
        await this.ensureTable();
        const uid = Number(user?.id);
        const satkerId = Number(user?.scope_satker_id || 0);
        const role = String(user?.role_bdb || '').toLowerCase();
        const isAdmin = role === 'superadmin' || role === 'admin_binops';
        const cat = category === 'dinas' ? 'dinas' : category === 'social' ? 'social' : null;
        const items = [];
        if (!cat || cat === 'social') {
            const rows = await this.dataSource.query(`SELECT n.id, n.category, n.type, n.post_id, n.title, n.message, n.link, n.is_read, n.created_at,
                        n.sender_id, u.name as sender_name, u.callsign as sender_callsign, u.username as sender_username, u.photo_url as sender_photo
                 FROM bdb_social_notifications n
                 LEFT JOIN auth_users u ON u.id = n.sender_id
                 WHERE n.recipient_id = $1 AND n.category = 'social'
                 ORDER BY n.created_at DESC
                 LIMIT 35`, [uid]);
            items.push(...rows.map((r) => ({
                id: Number(r.id),
                category: 'social',
                type: r.type,
                post_id: r.post_id ? Number(r.post_id) : null,
                title: r.title,
                message: r.message,
                is_read: Boolean(r.is_read),
                created_at: r.created_at,
                sender_id: r.sender_id ? Number(r.sender_id) : null,
                sender_handle: r.sender_id ? this.formatCallsign(r.sender_callsign || r.sender_username, r.sender_id, r.sender_username, r.sender_name) : null,
                sender_photo: this.resolveDefaultAvatar(r.sender_photo, r.sender_name, null, null),
                link: r.link || (r.type === 'message' && r.sender_id ? `/cms/broadcaster?view=obrolan&partner=${r.sender_id}` : (r.type === 'connection' && r.sender_id ? `/cms/broadcaster?view=koneksi&profileId=${r.sender_id}` : '/cms/broadcaster'))
            })));
            const connRows = await this.dataSource.query(`SELECT uc.id, uc.status, uc.updated_at as created_at,
                        u.id as other_id, u.name as other_name, u.username as other_username, u.callsign as other_callsign, u.photo_url as other_photo
                 FROM user_connections uc
                 JOIN auth_users u ON u.id = CASE WHEN uc.requester_id = $1 THEN uc.addressee_id ELSE uc.requester_id END
                 WHERE ((uc.addressee_id = $1 AND uc.status = 'PENDING') OR (uc.requester_id = $1 AND uc.status = 'ACCEPTED'))
                 ORDER BY uc.updated_at DESC
                 LIMIT 15`, [uid]);
            items.push(...connRows.map((r) => {
                const handle = this.formatCallsign(r.other_callsign || r.other_username, r.other_id, r.other_username, r.other_name).replace(/^@/, '');
                return {
                    id: 'conn_' + r.id,
                    category: 'social',
                    type: 'connection',
                    post_id: null,
                    title: 'Jejaring: ' + (r.other_name || handle),
                    message: r.status === 'PENDING' ? `Mengajukan koneksi dengan Anda (@${handle})` : `Anda sekarang terkoneksi dengan @${handle}`,
                    is_read: true,
                    created_at: r.created_at,
                    sender_id: Number(r.other_id),
                    sender_handle: '@' + handle,
                    sender_photo: this.resolveDefaultAvatar(r.other_photo, r.other_name, null, null),
                    link: `/cms/broadcaster?view=koneksi&profileId=${r.other_id}`
                };
            }));
        }
        if (!cat || cat === 'dinas') {
            const dinasRows = await this.dataSource.query(`SELECT n.id, n.category, n.type, n.post_id, n.title, n.message, n.link, n.is_read, n.created_at,
                        n.sender_id, u.name as sender_name, u.callsign as sender_callsign, u.username as sender_username, u.photo_url as sender_photo
                 FROM bdb_social_notifications n
                 LEFT JOIN auth_users u ON u.id = n.sender_id
                 WHERE n.recipient_id = $1 AND n.category = 'dinas'
                 ORDER BY n.created_at DESC
                 LIMIT 20`, [uid]);
            items.push(...dinasRows.map((r) => ({
                id: Number(r.id),
                category: 'dinas',
                type: r.type,
                post_id: r.post_id ? Number(r.post_id) : null,
                title: r.title,
                message: r.message,
                is_read: Boolean(r.is_read),
                created_at: r.created_at,
                sender_id: r.sender_id ? Number(r.sender_id) : null,
                sender_handle: r.sender_id ? this.formatCallsign(r.sender_callsign || r.sender_username, r.sender_id, r.sender_username, r.sender_name) : null,
                sender_photo: this.resolveDefaultAvatar(r.sender_photo, r.sender_name, null, null),
                link: r.link || '/cms/broadcaster'
            })));
            const satgasRows = await this.dataSource.query(`SELECT id, jenis, nama as title, deskripsi, created_at
                 FROM bdb_operasi_satgas
                 WHERE deleted_at IS NULL
                 ORDER BY created_at DESC
                 LIMIT 6`);
            items.push(...satgasRows.map((r) => ({
                id: 'satgas_' + r.id,
                category: 'dinas',
                type: r.jenis.toLowerCase(),
                post_id: null,
                title: r.title,
                message: `Ada ${r.jenis === 'SATGAS' ? 'Satgas Operasi' : 'Operasi Kepolisian'} Baru dari Robinops Bareskrim`,
                is_read: true,
                created_at: r.created_at,
                sender_handle: '@bareskrim',
                sender_photo: null,
                link: '/cms/master/operasi-satgas'
            })));
            const kermaRows = await this.dataSource.query(`SELECT id, institusi, tentang as title, created_at
                 FROM bdb_kerma_master
                 WHERE deleted_at IS NULL
                 ORDER BY created_at DESC
                 LIMIT 5`);
            items.push(...kermaRows.map((r) => ({
                id: 'kerma_' + r.id,
                category: 'dinas',
                type: 'kerma',
                post_id: null,
                title: r.title,
                message: `Kerjasama (Kerma) Baru dengan ${r.institusi}`,
                is_read: true,
                created_at: r.created_at,
                sender_handle: '@kerma_polri',
                sender_photo: null,
                link: '/cms/master/kerma'
            })));
            const lpSql = isAdmin
                ? `SELECT id, lp_id, satker_asal_nama, satker_tujuan_nama, created_at FROM bdb_lp_pelimpahan ORDER BY created_at DESC LIMIT 6`
                : `SELECT id, lp_id, satker_asal_nama, satker_tujuan_nama, created_at FROM bdb_lp_pelimpahan WHERE (satker_tujuan_id = $1 OR satker_asal_id = $1) ORDER BY created_at DESC LIMIT 6`;
            const lpParams = isAdmin ? [] : [satkerId];
            const lpRows = await this.dataSource.query(lpSql, lpParams);
            items.push(...lpRows.map((r) => ({
                id: 'lp_' + r.id,
                category: 'dinas',
                type: 'pelimpahan',
                post_id: null,
                title: `Pelimpahan ke ${r.satker_tujuan_nama || 'Satker Terkait'}`,
                message: `LP #${r.lp_id} dilimpahkan dari ${r.satker_asal_nama || 'Satker Asal'}`,
                is_read: true,
                created_at: r.created_at,
                sender_handle: '@robinops',
                sender_photo: null,
                link: '/cms/laporan-polisi'
            })));
        }
        items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const unreadCounts = await this.dataSource.query(`SELECT category, count(*)::int as c 
             FROM bdb_social_notifications 
             WHERE recipient_id = $1 AND is_read = false 
             GROUP BY category`, [uid]);
        let unreadDinas = 0;
        let unreadSocial = 0;
        unreadCounts.forEach((r) => {
            if (r.category === 'dinas')
                unreadDinas = Number(r.c);
            if (r.category === 'social')
                unreadSocial = Number(r.c);
        });
        return {
            status: 1,
            data: items.slice(0, 45),
            unread_dinas: unreadDinas,
            unread_social: unreadSocial
        };
    }
    async markNotificationRead(user, notifId) {
        await this.ensureTable();
        const uid = Number(user?.id);
        await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE id = $1 AND recipient_id = $2', [notifId, uid]);
        return { status: 1 };
    }
    async markAllNotificationsRead(user, category) {
        await this.ensureTable();
        const uid = Number(user?.id);
        if (category && (category === 'dinas' || category === 'social')) {
            await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE recipient_id = $1 AND category = $2', [uid, category]);
        }
        else {
            await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE recipient_id = $1', [uid]);
        }
        return { status: 1 };
    }
    async getMessageConversations(user) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        if (!uid)
            throw new common_1.ForbiddenException('Sesi tidak valid.');
        const aiRows = await this.dataSource.query(
            `SELECT id, sender_id, receiver_id, content, media_url, is_read, created_at
             FROM bdb_social_messages
             WHERE (sender_id = $1 AND receiver_id = -1) OR (sender_id = -1 AND receiver_id = $1)
             ORDER BY created_at DESC LIMIT 1`,
            [uid]
        );
        const aiLast = aiRows[0] || null;
        const aiChannel = {
            partner_id: -1,
            is_ai: true,
            name: 'AI Agen Taktis CAS',
            handle: '@ai_taktis_cas',
            satker: 'Robinopsnal Bareskrim Polri',
            pangkat: 'Asisten Cerdas 24/7',
            photo_url: '/images/default-avatar-polki.png',
            last_message: aiLast ? aiLast.content : 'Siap membantu analisis LP, DORS, KUHP Baru (UU 1/2023), dan SOP Penyidikan.',
            last_time: aiLast ? aiLast.created_at : new Date().toISOString(),
            unread_count: 0,
            online: true
        };
        const convRows = await this.dataSource.query(
            `WITH ranked_msgs AS (
                SELECT
                    m.id,
                    m.sender_id,
                    m.receiver_id,
                    m.content,
                    m.media_url,
                    m.is_read,
                    m.created_at,
                    CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END AS partner_id,
                    ROW_NUMBER() OVER (
                        PARTITION BY (CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END)
                        ORDER BY m.created_at DESC, m.id DESC
                    ) AS rn
                FROM bdb_social_messages m
                WHERE (m.sender_id = $1 OR m.receiver_id = $1)
                  AND m.sender_id <> -1 AND m.receiver_id <> -1
            ),
            unread_agg AS (
                SELECT sender_id AS partner_id, COUNT(*)::int AS unread_count
                FROM bdb_social_messages
                WHERE receiver_id = $1 AND is_read = false AND sender_id > 0
                GROUP BY sender_id
            )
            SELECT
                rm.partner_id,
                rm.content AS last_message,
                rm.created_at AS last_time,
                COALESCE(ua.unread_count, 0)::int AS unread_count,
                u.name,
                u.username,
                u.callsign,
                u.role_bdb,
                u.photo_url,
                u.social_media,
                u.last_login_at,
                s.nama_singkat AS satker_singkat,
                s.deskripsi AS satker_nama
            FROM ranked_msgs rm
            JOIN auth_users u ON u.id = rm.partner_id
            LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
            LEFT JOIN unread_agg ua ON ua.partner_id = rm.partner_id
            WHERE rm.rn = 1
            ORDER BY rm.created_at DESC
            LIMIT 60`,
            [uid]
        );
        const existingPartnerIds = new Set(convRows.map((r) => Number(r.partner_id)));
        const connFriends = await this.dataSource.query(
            `SELECT u.id AS partner_id, u.name, u.username, u.callsign, u.role_bdb, u.photo_url, u.social_media, u.last_login_at,
                    s.nama_singkat AS satker_singkat, s.deskripsi AS satker_nama, uc.updated_at AS conn_time
             FROM user_connections uc
             JOIN auth_users u ON u.id = CASE WHEN uc.requester_id = $1 THEN uc.addressee_id ELSE uc.requester_id END
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE (uc.requester_id = $1 OR uc.addressee_id = $1) AND uc.status = 'ACCEPTED'
             ORDER BY uc.updated_at DESC
             LIMIT 30`,
            [uid]
        );
        const mappedConvs = convRows.map((r) => {
            const pid = Number(r.partner_id);
            const isUserOne = this.isSuperUserOne(pid, r.username, r.callsign);
            const handle = this.formatCallsign(r.callsign || r.username, pid, r.username, r.name);
            const satker = isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_singkat || r.satker_nama || 'Polri');
            return {
                partner_id: pid,
                is_ai: false,
                name: isUserOne ? (r.name || 'EKO') : (r.name || handle),
                handle,
                satker,
                pangkat: isUserOne ? 'KOMPOL' : (r.role_bdb || 'Personil Polri'),
                photo_url: this.resolveDefaultAvatar(r.photo_url, r.name, null, r.social_media),
                last_message: r.last_message || '',
                last_time: r.last_time,
                unread_count: Number(r.unread_count || 0),
                online: Boolean(r.last_login_at && (Date.now() - new Date(r.last_login_at).getTime() < 24 * 3600 * 1000))
            };
        });
        for (const cf of connFriends) {
            const pid = Number(cf.partner_id);
            if (existingPartnerIds.has(pid) || pid === uid)
                continue;
            existingPartnerIds.add(pid);
            const isUserOne = this.isSuperUserOne(pid, cf.username, cf.callsign);
            const handle = this.formatCallsign(cf.callsign || cf.username, pid, cf.username, cf.name);
            const satker = isUserOne ? 'Robinopsnal Bareskrim Polri' : (cf.satker_singkat || cf.satker_nama || 'Polri');
            mappedConvs.push({
                partner_id: pid,
                is_ai: false,
                name: isUserOne ? (cf.name || 'EKO') : (cf.name || handle),
                handle,
                satker,
                pangkat: isUserOne ? 'KOMPOL' : (cf.role_bdb || 'Personil Polri'),
                photo_url: this.resolveDefaultAvatar(cf.photo_url, cf.name, null, cf.social_media),
                last_message: 'Terkoneksi di Jejaring Sharese — Mulai percakapan',
                last_time: cf.conn_time || new Date().toISOString(),
                unread_count: 0,
                online: Boolean(cf.last_login_at && (Date.now() - new Date(cf.last_login_at).getTime() < 24 * 3600 * 1000))
            });
        }
        const totalUnread = mappedConvs.reduce((acc, c) => acc + Number(c.unread_count || 0), 0);
        return {
            status: 1,
            data: [aiChannel, ...mappedConvs],
            total_unread: totalUnread
        };
    }
    async getMessageThread(user, targetIdStr) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        if (!uid)
            throw new common_1.ForbiddenException('Sesi tidak valid.');
        const isAiTarget = targetIdStr === 'ai' || targetIdStr === '-1' || Number(targetIdStr) === -1;
        const targetId = isAiTarget ? -1 : Number(targetIdStr);
        if (!isAiTarget && (!targetId || isNaN(targetId))) {
            throw new common_1.BadRequestException('ID lawan bicara tidak valid.');
        }
        if (!isAiTarget) {
            await this.dataSource.query(
                `UPDATE bdb_social_messages SET is_read = true WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false`,
                [targetId, uid]
            );
            await this.dataSource.query(
                `UPDATE bdb_social_notifications SET is_read = true WHERE recipient_id = $1 AND sender_id = $2 AND type = 'message' AND is_read = false`,
                [uid, targetId]
            );
        }
        const rows = await this.dataSource.query(
            `SELECT id, sender_id, receiver_id, content, media_url, is_read, created_at
             FROM bdb_social_messages
             WHERE (sender_id = $1 AND receiver_id = $2)
                OR (sender_id = $2 AND receiver_id = $1)
             ORDER BY created_at ASC, id ASC
             LIMIT 200`,
            [uid, targetId]
        );
        let partnerInfo = null;
        if (isAiTarget) {
            partnerInfo = {
                id: -1,
                is_ai: true,
                name: 'AI Agen Taktis CAS',
                handle: '@ai_taktis_cas',
                satker: 'Robinopsnal Bareskrim Polri',
                pangkat: 'Asisten Cerdas 24/7',
                photo_url: '/images/default-avatar-polki.png'
            };
        }
        else {
            const uRows = await this.dataSource.query(
                `SELECT u.id, u.name, u.username, u.callsign, u.role_bdb, u.photo_url, u.social_media,
                        s.nama_singkat AS satker_singkat, s.deskripsi AS satker_nama
                 FROM auth_users u
                 LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
                 WHERE u.id = $1 LIMIT 1`,
                [targetId]
            );
            if (uRows.length) {
                const r = uRows[0];
                const isUserOne = this.isSuperUserOne(r.id, r.username, r.callsign);
                const handle = this.formatCallsign(r.callsign || r.username, r.id, r.username, r.name);
                partnerInfo = {
                    id: Number(r.id),
                    is_ai: false,
                    name: isUserOne ? (r.name || 'EKO') : (r.name || handle),
                    handle,
                    satker: isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_singkat || r.satker_nama || 'Polri'),
                    pangkat: isUserOne ? 'KOMPOL' : (r.role_bdb || 'Personil Polri'),
                    photo_url: this.resolveDefaultAvatar(r.photo_url, r.name, null, r.social_media)
                };
            }
        }
        let messages = rows.map((m) => ({
            id: Number(m.id),
            sender_id: Number(m.sender_id),
            receiver_id: Number(m.receiver_id),
            is_mine: Number(m.sender_id) === uid,
            content: m.content,
            media_url: m.media_url || null,
            is_read: Boolean(m.is_read),
            created_at: m.created_at
        }));
        if (isAiTarget && messages.length === 0) {
            messages = [{
                id: 0,
                sender_id: -1,
                receiver_id: uid,
                is_mine: false,
                content: `Selamat bertugas, Rekan! Saya AI Agen Taktis CAS Robinopsnal Bareskrim Polri. Silakan tanyakan terkait Analisis LP, Sinkronisasi DORS, Referensi Pasal KUHP Baru (UU No. 1 Tahun 2023), maupun Panduan SOP Penyidikan.`,
                media_url: null,
                is_read: true,
                created_at: new Date().toISOString()
            }];
        }
        return {
            status: 1,
            partner: partnerInfo,
            data: messages
        };
    }
    buildAiTacticalReply(prompt, user) {
        const q = String(prompt || '').toLowerCase();
        const callerName = user?.name || user?.username || 'Rekan Penyidik';
        if (q.includes('kuhp') || q.includes('pasal') || q.includes('uu 1') || q.includes('pidana')) {
            return `📋 **[Analisis Regulasi & KUHP Baru — UU No. 1 Tahun 2023]**\nHalo ${callerName}, terkait pertanyaan Anda:\n1. Pastikan pemetaan unsur delik pada Laporan Polisi (LP) telah mencantumkan padanan pasal transisi KUHP Lama ke **UU No. 1 Tahun 2023**.\n2. Gunakan fitur **Smart Import PDF** atau **Audit Kesesuaian Pasal** pada menu *Laporan → Rekap* untuk memvalidasi kelengkapan administrasi penyidikan (Mindik).`;
        }
        if (q.includes('dors') || q.includes('integrasi') || q.includes('tarik') || q.includes('sinkron')) {
            return `🔄 **[Panduan Taktis Portal Integrasi DORS]**\nHalo ${callerName}, untuk sinkronisasi data DORS Robinopsnal:\n1. Buka menu **Portal Integrasi → Masuk → Tarik Data** untuk mengambil data LP terbaru dari sumber DORS.\n2. Lanjutkan ke **Staging** & **Cek Duplikat** sebelum melakukan *Import ke Database* utama agar tidak terjadi duplikasi nomor LP.`;
        }
        if (q.includes('selra') || q.includes('p21') || q.includes('sp3') || q.includes('rj') || q.includes('restorative')) {
            return `⚖️ **[Monitoring Penyelesaian Perkara (Selra)]**\nHalo ${callerName}, pencatatan penyelesaian perkara (**P-21, SP3, RJ, SP2Lid, maupun Pelimpahan**) wajib disertai dokumen lampiran PDF resmi dan mengacu pada alur dokumen penyidikan di menu **Register** serta **Laporan → Kinerja Perkara**.`;
        }
        return `🛡️ **[AI Agen Taktis CAS — Robinopsnal Bareskrim Polri]**\nTerima kasih ${callerName}. Pesan Anda: *"${String(prompt || '').slice(0, 120)}"* telah dicatat oleh asisten taktis.\n\nSaya siap membantu Anda dalam:\n• Pemeriksaan kelengkapan **Laporan Polisi & Selra**\n• Panduan **Portal Integrasi (DORS Masuk & Keluar)**\n• Pemantauan **Susopsgas (Operasi & Satgas)** serta **Kerja Sama (Kerma)**.\nKetik topik spesifik (misal: *KUHP*, *DORS*, *Selra*, atau *Susopsgas*) untuk instruksi detail.`;
    }
    async sendSocialMessage(user, body) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        if (!uid)
            throw new common_1.ForbiddenException('Sesi tidak valid.');
        const rawTarget = body?.receiver_id;
        const isAiTarget = rawTarget === 'ai' || rawTarget === -1 || String(rawTarget) === '-1';
        const receiverId = isAiTarget ? -1 : Number(rawTarget);
        const text = String(body?.content || '').trim();
        const mediaUrl = body?.media_url ? String(body.media_url).trim() : null;
        if (!text && !mediaUrl) {
            throw new common_1.BadRequestException('Pesan tidak boleh kosong.');
        }
        if (!isAiTarget && (!receiverId || isNaN(receiverId) || receiverId === uid)) {
            throw new common_1.BadRequestException('Penerima pesan tidak valid.');
        }
        const inserted = await this.dataSource.query(
            `INSERT INTO bdb_social_messages (sender_id, receiver_id, content, media_url, is_read, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             RETURNING id, sender_id, receiver_id, content, media_url, is_read, created_at`,
            [uid, receiverId, text, mediaUrl, isAiTarget ? true : false]
        );
        const sentMsg = {
            ...inserted[0],
            id: Number(inserted[0].id),
            sender_id: uid,
            receiver_id: receiverId,
            is_mine: true
        };
        let aiReplyMsg = null;
        if (isAiTarget) {
            const replyText = this.buildAiTacticalReply(text, user);
            const aiIns = await this.dataSource.query(
                `INSERT INTO bdb_social_messages (sender_id, receiver_id, content, media_url, is_read, created_at)
                 VALUES (-1, $1, $2, NULL, true, NOW() + interval '1 millisecond')
                 RETURNING id, sender_id, receiver_id, content, media_url, is_read, created_at`,
                [uid, replyText]
            );
            aiReplyMsg = {
                ...aiIns[0],
                id: Number(aiIns[0].id),
                sender_id: -1,
                receiver_id: uid,
                is_mine: false
            };
        }
        else {
            const senderHandle = this.formatCallsign(user?.callsign || user?.username, uid, user?.username);
            await this.createNotification({
                recipientId: receiverId,
                senderId: uid,
                category: 'social',
                type: 'message',
                title: `Pesan Baru dari ${user?.name || senderHandle}`,
                message: text.length > 80 ? text.slice(0, 80) + '...' : text,
                link: `/cms/broadcaster?view=obrolan&partner=${uid}`
            });
        }
        return {
            status: 1,
            message: 'Pesan terkirim.',
            data: sentMsg,
            ai_reply: aiReplyMsg
        };
    }
    async getAccountInsight(user) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        if (!uid)
            throw new common_1.ForbiddenException('Sesi tidak valid.');
        const statsRes = await this.dataSource.query(
            `SELECT
                (SELECT COUNT(*)::int FROM bdb_social_posts WHERE author_id = $1 AND status = 'active') AS total_posts,
                (SELECT COUNT(*)::int FROM bdb_social_posts WHERE author_id = $1 AND status = 'active' AND is_official_jukrah = true) AS total_jukrah_posts,
                (SELECT COALESCE(SUM(repost_count), 0)::int FROM bdb_social_posts WHERE author_id = $1 AND status = 'active') AS total_reposts,
                (SELECT COUNT(*)::int FROM bdb_social_reactions r JOIN bdb_social_posts p ON p.id = r.post_id WHERE p.author_id = $1 AND p.status = 'active') AS total_reactions_received,
                (SELECT COUNT(*)::int FROM bdb_social_comments c JOIN bdb_social_posts p ON p.id = c.post_id WHERE p.author_id = $1 AND p.status = 'active') AS total_comments_received,
                (SELECT COUNT(*)::int FROM bdb_social_read_receipts rr JOIN bdb_social_posts p ON p.id = rr.post_id WHERE p.author_id = $1 AND p.status = 'active') AS total_read_receipts,
                (SELECT COUNT(*)::int FROM bdb_social_bookmarks b JOIN bdb_social_posts p ON p.id = b.post_id WHERE p.author_id = $1 AND p.status = 'active') AS total_bookmarks_received,
                (SELECT COUNT(*)::int FROM (
                    SELECT addressee_id FROM user_connections WHERE requester_id = $1 AND status = 'ACCEPTED'
                    UNION
                    SELECT requester_id FROM user_connections WHERE addressee_id = $1 AND status = 'ACCEPTED'
                ) conn) AS total_connections,
                (SELECT COUNT(*)::int FROM bdb_social_messages WHERE sender_id = $1 OR receiver_id = $1) AS total_messages
            `,
            [uid]
        );
        const st = statsRes[0] || {};
        const topPosts = await this.dataSource.query(
            `SELECT p.id, p.content, p.audience_type, p.is_official_jukrah, p.repost_count, p.reaction_counts, p.created_at,
                    (SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id) AS comments_count,
                    (SELECT COUNT(*)::int FROM bdb_social_reactions r WHERE r.post_id = p.id) AS reactions_count,
                    (SELECT COUNT(*)::int FROM bdb_social_read_receipts rr WHERE rr.post_id = p.id) AS reads_count
             FROM bdb_social_posts p
             WHERE p.author_id = $1 AND p.status = 'active'
             ORDER BY (COALESCE((SELECT COUNT(*)::int FROM bdb_social_reactions r WHERE r.post_id = p.id), 0) * 2 +
                       COALESCE((SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id), 0) * 3 +
                       COALESCE(p.repost_count, 0) * 4) DESC, p.created_at DESC
             LIMIT 10`,
            [uid]
        );
        const satkerDist = await this.dataSource.query(
            `SELECT COALESCE(s.nama_singkat, s.deskripsi, 'Polri') AS satker_label, COUNT(DISTINCT u.id)::int AS personil_count
             FROM (
                SELECT r.user_id FROM bdb_social_reactions r JOIN bdb_social_posts p ON p.id = r.post_id WHERE p.author_id = $1
                UNION ALL
                SELECT c.user_id FROM bdb_social_comments c JOIN bdb_social_posts p ON p.id = c.post_id WHERE p.author_id = $1
                UNION ALL
                SELECT CASE WHEN uc.requester_id = $1 THEN uc.addressee_id ELSE uc.requester_id END AS user_id
                FROM user_connections uc WHERE (uc.requester_id = $1 OR uc.addressee_id = $1) AND uc.status = 'ACCEPTED'
             ) eng
             JOIN auth_users u ON u.id = eng.user_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             GROUP BY COALESCE(s.nama_singkat, s.deskripsi, 'Polri')
             ORDER BY personil_count DESC
             LIMIT 8`,
            [uid]
        );
        const totalImpressions = (Number(st.total_posts || 0) * 42) +
            (Number(st.total_reactions_received || 0) * 11) +
            (Number(st.total_comments_received || 0) * 15) +
            (Number(st.total_read_receipts || 0) * 8) +
            (Number(st.total_connections || 0) * 9);
        return {
            status: 1,
            data: {
                total_posts: Number(st.total_posts || 0),
                total_jukrah_posts: Number(st.total_jukrah_posts || 0),
                total_reposts: Number(st.total_reposts || 0),
                total_reactions_received: Number(st.total_reactions_received || 0),
                total_comments_received: Number(st.total_comments_received || 0),
                total_read_receipts: Number(st.total_read_receipts || 0),
                total_bookmarks_received: Number(st.total_bookmarks_received || 0),
                total_connections: Number(st.total_connections || 0),
                total_messages: Number(st.total_messages || 0),
                estimated_reach: totalImpressions,
                top_posts: topPosts.map((p) => ({
                    id: Number(p.id),
                    content: p.content,
                    audience_type: p.audience_type,
                    is_official_jukrah: Boolean(p.is_official_jukrah),
                    repost_count: Number(p.repost_count || 0),
                    comments_count: Number(p.comments_count || 0),
                    reactions_count: Number(p.reactions_count || 0),
                    reads_count: Number(p.reads_count || 0),
                    created_at: p.created_at
                })),
                satker_distribution: satkerDist
            }
        };
    }
    async getPusatBantuanCards() {
        await this.ensureTable();
        const defaultCards = [
            {
                id: 'wa-helpdesk',
                title: 'WhatsApp Helpdesk Robinopsnal',
                subtitle: 'Layanan Cepat Tanggap Teknis & Operasional 24/7',
                contact: '+62 811-9000-110',
                action_url: 'https://wa.me/628119000110',
                badge: 'Prioritas Utama (24 Jam)',
                icon: 'whatsapp',
                active: true
            },
            {
                id: 'email-support',
                title: 'Email Resmi Dukungan Sistem CAS',
                subtitle: 'Korespondensi Kendala Akun, Hak Akses Satker & Sinkronisasi DORS',
                contact: 'helpdesk.robinops@bareskrim.polri.go.id',
                action_url: 'mailto:helpdesk.robinops@bareskrim.polri.go.id',
                badge: 'SLA Respon < 2 Jam Kerja',
                icon: 'mail',
                active: true
            },
            {
                id: 'call-center',
                title: 'Posko Piket Command Center Bareskrim',
                subtitle: 'Saluran Telepon Langsung Piket Pengawas Sistem Big Data Binops',
                contact: '(021) 721-8001 / Ext. 402',
                action_url: 'tel:0217218001',
                badge: 'Jam Dinas & Piket Siaga',
                icon: 'phone',
                active: true
            },
            {
                id: 'panduan-sop',
                title: 'Buku Panduan & SOP Penggunaan Sistem',
                subtitle: 'Dokumentasi Lengkap Modul Laporan Polisi, Register, Susopsgas & Sharese',
                contact: 'Modul Panduan Pengguna Terpadu',
                action_url: '/cms/panduan',
                badge: 'E-Book & Video Tutorial',
                icon: 'book',
                active: true
            }
        ];
        try {
            const rows = await this.dataSource.query(
                `SELECT value FROM bdb_system_settings WHERE key IN ('pusat_bantuan_cards', 'help_center_cards', 'pusat_bantuan') ORDER BY updated_at DESC LIMIT 1`
            );
            if (rows.length && rows[0].value) {
                const parsed = typeof rows[0].value === 'string' ? JSON.parse(rows[0].value) : rows[0].value;
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return { status: 1, data: parsed };
                }
                if (parsed && Array.isArray(parsed.cards) && parsed.cards.length > 0) {
                    return { status: 1, data: parsed.cards };
                }
            }
        }
        catch { }
        return { status: 1, data: defaultCards };
    }
    async getDashboardWidgets(user) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const jukrahRows = await this.dataSource.query(`SELECT p.id, p.author_id, p.content, p.created_at, s.nama_singkat as satker,
                    u.name as raw_author_name, u.username as author_username, u.callsign as author_callsign,
                    CASE WHEN rr.id IS NOT NULL THEN true ELSE false END as acknowledged
             FROM bdb_social_posts p
             JOIN auth_users u ON u.id = p.author_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             LEFT JOIN bdb_social_read_receipts rr ON rr.post_id = p.id AND rr.user_id = $1
             WHERE p.is_official_jukrah = true AND p.status = 'active'
             ORDER BY p.created_at DESC
             LIMIT 1`, [uid]);
        const latestJukrah = jukrahRows.length ? {
            id: Number(jukrahRows[0].id),
            title: jukrahRows[0].content.slice(0, 90),
            author_handle: this.formatCallsign(jukrahRows[0].author_callsign, jukrahRows[0].author_id, jukrahRows[0].author_username, jukrahRows[0].raw_author_name),
            satker: jukrahRows[0].satker || 'Robinopsnal Bareskrim Polri',
            created_at: jukrahRows[0].created_at,
            acknowledged: Boolean(jukrahRows[0].acknowledged)
        } : null;
        const trendingRows = await this.dataSource.query(`SELECT p.id, p.content, p.reaction_counts, p.created_at,
                    u.id as author_id, u.name as raw_author_name, u.username as author_username, u.callsign, s.nama_singkat as satker,
                    (SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id) as comments_count
             FROM bdb_social_posts p
             JOIN auth_users u ON u.id = p.author_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE p.status = 'active' AND p.audience_type = 'public'
             ORDER BY (p.repost_count * 3 + (SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id) * 2) DESC, p.created_at DESC
             LIMIT 1`);
        const topTrending = trendingRows.length ? {
            id: Number(trendingRows[0].id),
            snippet: trendingRows[0].content.slice(0, 85),
            author_handle: this.formatCallsign(trendingRows[0].callsign, trendingRows[0].author_id, trendingRows[0].author_username, trendingRows[0].raw_author_name),
            satker: this.isSuperUserOne(trendingRows[0].author_id, trendingRows[0].author_username, trendingRows[0].callsign)
                ? 'Robinopsnal Bareskrim Polri'
                : (trendingRows[0].satker || 'Polri'),
            comments_count: Number(trendingRows[0].comments_count || 0),
            reaction_counts: trendingRows[0].reaction_counts || {}
        } : null;
        const userStats = await this.dataSource.query(`SELECT 
                u.id, u.name, u.username, u.callsign,
                (SELECT COUNT(*)::int FROM bdb_social_posts WHERE author_id = $1 AND status = 'active') as my_posts,
                (SELECT COUNT(*)::int FROM bdb_social_notifications WHERE recipient_id = $1 AND is_read = false AND category = 'dinas') as unread_dinas
             FROM auth_users u WHERE u.id = $1`, [uid]);
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
    async getJukrahReadReport(user, postId) {
        const rows = await this.dataSource.query(`SELECT 
                s.id as satker_id,
                s.deskripsi as satker_nama,
                s.nama_singkat as satker_singkat,
                COUNT(DISTINCT u.id)::int as total_personil,
                COUNT(DISTINCT rr.user_id)::int as total_sudah_baca
             FROM auth_users u
             JOIN bdb_satker s ON s.id = u.scope_satker_id
             LEFT JOIN bdb_social_read_receipts rr ON rr.post_id = $1 AND rr.user_id = u.id
             WHERE u.status = 'active'
             GROUP BY s.id, s.deskripsi, s.nama_singkat
             ORDER BY total_sudah_baca DESC, total_personil DESC`, [postId]);
        return { status: 1, data: rows };
    }
    async recordView(jukrahId, user, nama) {
        const uid = user?.id;
        if (!uid)
            return;
        const ins = await this.dataSource.query('insert into bdb_jukrah_view (jukrah_id, user_id) values ($1,$2) on conflict (jukrah_id, user_id) do nothing returning id', [jukrahId, uid]);
        if (ins.length) {
            await this.audit.log({ user, action: 'VIEW', entity: 'jukrah', entityId: jukrahId, meta: { nama } });
        }
    }
    async withUrl(rows) {
        for (const r of rows) {
            if (r.lampiran?.key) {
                try {
                    r.lampiran.url = await this.minio.presignedUrl(r.lampiran.key);
                }
                catch {
                }
            }
        }
        return rows;
    }
    verifyMagicBytes(buffer, ext) {
        if (!buffer || buffer.length < 4) {
            throw new common_1.BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
        }
        if (buffer[0] === 0x4D && buffer[1] === 0x5A) {
            throw new common_1.BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
        }
        if (buffer[0] === 0x7F && buffer[1] === 0x45 && buffer[2] === 0x4C && buffer[3] === 0x46) {
            throw new common_1.BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
        }
        const headStr = buffer.subarray(0, Math.min(256, buffer.length)).toString('utf8').toLowerCase();
        if (
            headStr.includes('<?php') ||
            headStr.includes('<script') ||
            headStr.includes('#!/bin/sh') ||
            headStr.includes('#!/bin/bash')
        ) {
            throw new common_1.BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
        }
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
                throw new common_1.BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
            }
        } else if (cleanExt === '.jpg' || cleanExt === '.jpeg') {
            if (buffer[0] !== 0xFF || buffer[1] !== 0xD8 || buffer[2] !== 0xFF) {
                throw new common_1.BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
            }
        } else if (cleanExt === '.png') {
            if (
                buffer[0] !== 0x89 ||
                buffer[1] !== 0x50 ||
                buffer[2] !== 0x4E ||
                buffer[3] !== 0x47
            ) {
                throw new common_1.BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
            }
        } else if (cleanExt === '.gif') {
            const gifSig = buffer.subarray(0, 6).toString('ascii');
            if (gifSig !== 'GIF87a' && gifSig !== 'GIF89a') {
                throw new common_1.BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
            }
        } else if (cleanExt === '.webp') {
            const riffSig = buffer.subarray(0, 4).toString('ascii');
            const webpSig = buffer.length >= 12 ? buffer.subarray(8, 12).toString('ascii') : '';
            if (riffSig !== 'RIFF' || webpSig !== 'WEBP') {
                throw new common_1.BadRequestException('Keamanan MIME: Isi biner file tidak sesuai dengan ekstensi atau terdeteksi berbahaya.');
            }
        }
    }
    async saveUploadedFile(file, folder = 'social') {
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
    async uploadPdf(file) {
        if (!file)
            return null;
        if (file.mimetype !== 'application/pdf')
            throw new common_1.BadRequestException('Lampiran harus berupa file PDF.');
        if (file?.buffer) {
            this.verifyMagicBytes(file.buffer, '.pdf');
        }
        const key = await this.saveUploadedFile(file, 'jukrah');
        return { name: file.originalname, key, size: file.size, mime: file.mimetype };
    }
    async list(opts) {
        await this.ensureTable();
        const params = [];
        const wh = [];
        if (opts.search && opts.search.trim()) {
            params.push(`%${opts.search.trim()}%`);
            wh.push(`(b.nama ilike $${params.length} or b.deskripsi ilike $${params.length})`);
        }
        if (opts.aktif === 'true')
            wh.push('b.aktif=true');
        else if (opts.aktif === 'false')
            wh.push('b.aktif=false');
        const where = wh.length ? 'where ' + wh.join(' and ') : '';
        const rows = await this.dataSource.query(`select b.id, b.nama, b.deskripsi, b.aktif, b.lampiran, b.tanggal_publish, b.created_at, b.updated_at, u.name as created_by_nama,
                    (select count(*) from bdb_jukrah_view v where v.jukrah_id=b.id)::int as view_count
             from bdb_jukrah b left join auth_users u on u.id=b.created_by ${where} order by b.tanggal_publish desc, b.id desc`, params);
        return { status: 1, data: await this.withUrl(rows) };
    }
    async active(user, opts) {
        await this.ensureTable();
        const params = [];
        let where = 'where aktif=true and tanggal_publish <= current_date';
        if (opts.search && opts.search.trim()) {
            params.push(`%${opts.search.trim()}%`);
            where += ' and (nama ilike $1 or deskripsi ilike $1)';
        }
        const rows = await this.dataSource.query(`select id, nama, deskripsi, lampiran, tanggal_publish from bdb_jukrah ${where} order by tanggal_publish desc, id desc`, params);
        for (const r of rows)
            await this.recordView(r.id, user, r.nama);
        if (rows.length) {
            const counts = await this.dataSource.query(`select jukrah_id, count(*)::int c from bdb_jukrah_view where jukrah_id = any($1) group by jukrah_id`, [rows.map((r) => r.id)]);
            const map = new Map(counts.map((c) => [Number(c.jukrah_id), c.c]));
            for (const r of rows)
                r.view_count = map.get(Number(r.id)) || 0;
        }
        return { status: 1, data: await this.withUrl(rows) };
    }
    async create(user, body, file) {
        await this.ensureTable();
        const nama = (body.nama || '').trim();
        if (!nama)
            throw new common_1.BadRequestException('Nama wajib diisi.');
        if (body.tanggal_publish) {
            const chk = await this.dataSource.query('select ($1::date < current_date) as bad', [body.tanggal_publish]);
            if (chk[0]?.bad)
                throw new common_1.BadRequestException('Tanggal publikasi tidak boleh mundur (backdate).');
        }
        const lampiran = await this.uploadPdf(file);
        const aktif = !(body.aktif === 'false' || body.aktif === false);
        const r = await this.dataSource.query('insert into bdb_jukrah (nama, deskripsi, aktif, lampiran, tanggal_publish, created_by) values ($1,$2,$3,$4,coalesce($5::date, current_date),$6) returning id', [nama, body.deskripsi?.trim() || null, aktif, lampiran ? JSON.stringify(lampiran) : null, body.tanggal_publish || null, user?.id || null]);
        await this.audit.log({ user, action: 'CREATE', entity: 'jukrah', entityId: r[0].id, meta: { nama } });
        return { status: 1, data: { id: r[0].id }, message: 'Pengumuman ditambahkan.' };
    }
    async update(user, id, body, file, keepLampiran) {
        await this.ensureTable();
        const ex = await this.dataSource.query('select * from bdb_jukrah where id=$1', [id]);
        if (!ex.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        const nama = (body.nama || '').trim();
        if (!nama)
            throw new common_1.BadRequestException('Nama wajib diisi.');
        if (body.tanggal_publish) {
            const chk = await this.dataSource.query('select ($1::date < current_date and $1::date <> tanggal_publish) as bad from bdb_jukrah where id=$2', [body.tanggal_publish, id]);
            if (chk[0]?.bad)
                throw new common_1.BadRequestException('Tanggal publikasi tidak boleh mundur (backdate).');
        }
        let lampiran = ex[0].lampiran;
        if (file)
            lampiran = await this.uploadPdf(file);
        else if (keepLampiran === 'false' || keepLampiran === false)
            lampiran = null;
        const aktif = body.aktif === undefined ? ex[0].aktif : !(body.aktif === 'false' || body.aktif === false);
        await this.dataSource.query('update bdb_jukrah set nama=$2, deskripsi=$3, aktif=$4, lampiran=$5, tanggal_publish=coalesce($6::date, tanggal_publish), updated_at=now() where id=$1', [id, nama, body.deskripsi?.trim() || null, aktif, lampiran ? JSON.stringify(lampiran) : null, body.tanggal_publish || null]);
        await this.audit.log({ user, action: 'UPDATE', entity: 'jukrah', entityId: id, meta: { nama } });
        return { status: 1, message: 'Pengumuman diperbarui.' };
    }
    async remove(user, id) {
        await this.ensureTable();
        const [r] = await this.dataSource.query('delete from bdb_jukrah where id=$1 returning id, nama', [id]);
        if (!r.length)
            throw new common_1.NotFoundException('Data tidak ditemukan.');
        await this.audit.log({ user, action: 'DELETE', entity: 'jukrah', entityId: id, meta: { nama: r[0].nama } });
        return { status: 1, message: 'Pengumuman dihapus.' };
    }
};
exports.JukrahService = JukrahService;
exports.JukrahService = JukrahService = JukrahService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        minio_service_1.MinioService,
        audit_service_1.AuditService])
], JukrahService);
//# sourceMappingURL=jukrah.service.js.map