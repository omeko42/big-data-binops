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
        try {
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_user_conn_req_status ON user_connections (requester_id, status)');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_user_conn_addr_status ON user_connections (addressee_id, status)');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_trb_police_lower_email ON trb_police (LOWER(email))');
            await this.dataSource.query('CREATE INDEX IF NOT EXISTS idx_auth_users_status_login ON auth_users (status, last_login_at DESC NULLS LAST, id ASC)');
        }
        catch { }
        this.clearNetworkUsersCache();
        this.ready = true;
    }
    isFemalePersonnel(name, jenisKelamin, socialMedia) {
        const jk = String(jenisKelamin || socialMedia?.gender || socialMedia?.jenis_kelamin || '').trim().toLowerCase();
        if (['p', 'perempuan', 'wanita', 'female', 'f', 'polwan'].includes(jk))
            return true;
        const n = String(name || '').trim();
        if (!n)
            return false;
        return /\b(siti|sri|dewi|dewie|ayu|putri|dian|fitri|fitria|fitriani|nurul|rina|rini|desi|desy|mega|ratna|wulan|wulandari|indah|intan|novita|novi|lestari|anggraini|maharani|puspita|handayani|kusumawati|rahmawati|susanti|astuti|widyastuti|yuliani|yulia|yuni|wahyuni|fatimah|alfia|amini|tita|maria|theresia|veronica|natalia|debora|chintya|nadia|nabila|annisa|anisa|aulia|amelia|amalia|tiara|citra|maya|lina|linda|nina|dina|vina|vera|sari|wati|ningrum|ningsih|pratiwi|yashinta|prameswari|retno|endang|ni\s+putu|ni\s+made|ni\s+luh|ni\s+wayan|ni\s+kadek|ni\s+komang|ni\s+nyoman|ni\s+ketut)\b/i.test(n);
    }
    resolveDefaultAvatar(photoUrl, name, jenisKelamin, socialMedia) {
        const clean = String(photoUrl || '').trim();
        if (clean.length > 5 && clean !== 'null' && clean !== 'undefined')
            return clean;
        return this.isFemalePersonnel(name, jenisKelamin, socialMedia)
            ? '/images/default-avatar-polwan.jpg'
            : '/images/default-avatar-polki.png';
    }
    resolveDefaultBanner(socialMedia) {
        const b = socialMedia?.banner_theme;
        if (typeof b === 'string' && (b.startsWith('data:image') || b.startsWith('http') || b.startsWith('/'))) {
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
    formatCallsign(rawCallsign, authorId, username) {
        const idStr = String(authorId || '');
        let c = String(rawCallsign || '').trim().replace(/^@/, '');
        if (c.startsWith('pers_') || (c.startsWith('user_') && !/^[a-zA-Z0-9_]{15,}$/.test(c)))
            c = '';
        const invalidPlaceholders = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse'];
        if (c && /^[a-zA-Z0-9_.]{3,30}$/.test(c) && !invalidPlaceholders.includes(c.toLowerCase()) && !c.startsWith('user_')) {
            return '@' + c.toLowerCase();
        }
        let u = String(username || '').trim().replace(/^@/, '');
        if (u && /^[a-zA-Z0-9_.]{3,30}$/.test(u) && !invalidPlaceholders.includes(u.toLowerCase()) && !u.startsWith('user_')) {
            return '@' + u.toLowerCase();
        }
        if (c && /^[a-zA-Z0-9_.]{3,30}$/.test(c) && !invalidPlaceholders.includes(c.toLowerCase())) {
            return '@' + c.toLowerCase();
        }
        if (idStr === '1')
            return '@om.eko_42';
        const seed = idStr || 'polri';
        let num = 0;
        for (let i = 0; i < seed.length; i++)
            num = (num * 31 + seed.charCodeAt(i)) % 100000;
        const code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
        return '@user_' + (idStr || '0') + code;
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
            const handle = this.formatCallsign(r.author_callsign, r.author_id, r.author_username);
            const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;
            const displayName = isUserOne ? (r.raw_author_name || 'EKO') : (canSeeRealName ? (r.raw_author_name || handle) : handle);
            const authorSatker = isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.author_satker_singkat || r.author_satker_nama || 'Polri');
            const isVerified = isUserOne ? true : Boolean(r.author_role && r.author_role !== 'sharese');
            const authorRole = isUserOne ? 'superadmin' : (r.author_role || 'sharese');
            const resolvedPhoto = this.resolveDefaultAvatar(r.author_photo, r.raw_author_name, null, null);
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
                        author_handle: this.formatCallsign(p.callsign, p.author_id, p.username),
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
            const key = await this.minio.upload(file, 'social');
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
                    u.id as user_id, u.name, u.username, u.callsign, u.photo_url, u.role_bdb,
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
            const resolvedPhoto = this.resolveDefaultAvatar(r.photo_url || r.foto, r.name, r.jenis_kelamin, null);
            return {
                id: Number(r.id),
                reaction_type: r.reaction_type,
                created_at: r.created_at,
                is_verified: isVerified,
                user: {
                    id: Number(r.user_id),
                    name: isUserOne ? (r.name || 'EKO') : r.name,
                    username: r.username,
                    callsign: r.callsign || r.username || 'personil',
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
                SELECT u.id, u.name, u.username, u.callsign, u.email, u.email_polri, u.role_bdb, u.photo_url, u.last_login_at, u.scope_satker_id, u.scope_satker_key${countWindowSelect}
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
        const data = rows.map((r) => {
            const isUserOne = this.isSuperUserOne(r.id, r.username, r.callsign);
            const nrpFallback = r.email && r.email.match(/^(\d{7,10})@/) ? r.email.match(/^(\d{7,10})@/)[1] : (r.email_polri && r.email_polri.match(/^(\d{7,10})@/) ? r.email_polri.match(/^(\d{7,10})@/)[1] : null);
            const satkerSpecific = isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_singkat || r.satker_nama || r.satuan || 'Polri');
            const isFemale = this.isFemalePersonnel(r.name, r.jenis_kelamin, null);
            const resolvedPhoto = this.resolveDefaultAvatar(r.photo_url || r.police_foto, r.name, r.jenis_kelamin, null);
            return {
                id: Number(r.id),
                name: isUserOne ? (r.name || 'EKO') : r.name,
                callsign: r.callsign || r.username || (r.email_polri ? r.email_polri.split('@')[0] : (r.email ? r.email.split('@')[0] : 'personil_' + r.id)),
                username: r.username,
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
                is_connected: Boolean(connectedTo) || isSuperadmin || Number(r.id) === uid,
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
        const uRes = await this.dataSource.query(sql, params);
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
        const rawSocial = { ...(policeProfile?.social_media || {}), ...(target.social_media || {}) };
        const resolvedBanner = this.resolveDefaultBanner(rawSocial);
        const mergedSocial = { ...rawSocial, banner_theme: resolvedBanner };
        const isFemale = this.isFemalePersonnel(target.name || policeProfile?.nama, policeProfile?.jenis_kelamin, mergedSocial);
        const resolvedPhoto = this.resolveDefaultAvatar(target.photo_url || policeProfile?.foto, target.name || policeProfile?.nama, policeProfile?.jenis_kelamin, mergedSocial);
        return {
            status: 1,
            data: {
                id: Number(target.id),
                name: isUserOne ? (target.name || 'EKO') : target.name,
                username: target.username,
                callsign: target.callsign || target.username || (target.email_polri ? target.email_polri.split('@')[0] : (target.email ? target.email.split('@')[0] : 'personil')),
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
                social_media: mergedSocial,
                last_login_at: target.last_login_at
            }
        };
    }
    async getComments(user, postId) {
        await this.ensureTable();
        const uid = Number(user?.id || 0);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        const rows = await this.dataSource.query(`SELECT c.id, c.parent_id, c.content, c.created_at, c.is_edited, c.updated_at,
                    p.author_id as post_author_id,
                    u.id as author_id, u.name as raw_name, u.callsign, u.username, u.role_bdb, u.photo_url,
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
            const handle = this.formatCallsign(r.callsign, r.author_id, r.username);
            const cleanCallsign = handle.startsWith('@') ? handle.slice(1) : handle;
            return {
                id: Number(r.id),
                parent_id: r.parent_id ? Number(r.parent_id) : null,
                content: r.content,
                created_at: r.created_at,
                updated_at: r.updated_at || r.created_at,
                is_edited: Boolean(r.is_edited),
                author_id: Number(r.author_id),
                author_username: r.username || cleanCallsign,
                author_callsign: r.callsign || cleanCallsign,
                author_handle: handle,
                author_name: isUserOne ? (r.raw_name || 'EKO') : (canSeeReal ? (r.raw_name || handle) : handle),
                author_role: isUserOne ? 'superadmin' : (r.role_bdb || 'sharese'),
                author_satker: isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker || r.satker_nama || 'Polri'),
                author_photo: this.resolveDefaultAvatar(r.photo_url, r.raw_name, null, null),
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
        const uRows = await this.dataSource.query(`SELECT u.id, u.name, u.username, u.callsign, u.role_bdb, u.photo_url,
                    s.nama_singkat as satker, s.deskripsi as satker_nama
             FROM auth_users u
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE u.id = $1`, [uid]);
        const uInfo = uRows[0] || user || {};
        const isUserOne = this.isSuperUserOne(uid, uInfo.username, uInfo.callsign);
        const handle = this.formatCallsign(uInfo.callsign, uid, uInfo.username);
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
                author_username: uInfo.username || cleanCallsign,
                author_callsign: uInfo.callsign || cleanCallsign,
                author_handle: handle,
                author_name: isUserOne ? (uInfo.name || 'EKO') : (uInfo.name || handle),
                author_role: isUserOne ? 'superadmin' : (uInfo.role_bdb || 'sharese'),
                author_satker: isUserOne ? 'Robinopsnal Bareskrim Polri' : (uInfo.satker || uInfo.satker_nama || 'Polri'),
                author_photo: this.resolveDefaultAvatar(uInfo.photo_url, uInfo.name, null, null),
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
            await this.dataSource.query(`INSERT INTO bdb_social_notifications (recipient_id, sender_id, category, type, post_id, title, message)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`, [data.recipientId, data.senderId, data.category, data.type, data.postId || null, data.title, data.message]);
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
        const uid = Number(user?.id);
        const satkerId = Number(user?.scope_satker_id || 0);
        const role = String(user?.role_bdb || '').toLowerCase();
        const isAdmin = role === 'superadmin' || role === 'admin_binops';
        const cat = category === 'dinas' ? 'dinas' : category === 'social' ? 'social' : null;
        const items = [];
        if (!cat || cat === 'social') {
            const rows = await this.dataSource.query(`SELECT n.id, n.category, n.type, n.post_id, n.title, n.message, n.is_read, n.created_at,
                        u.name as sender_name, u.callsign as sender_callsign, u.photo_url as sender_photo
                 FROM bdb_social_notifications n
                 LEFT JOIN auth_users u ON u.id = n.sender_id
                 WHERE n.recipient_id = $1 AND n.category = 'social'
                 ORDER BY n.created_at DESC
                 LIMIT 25`, [uid]);
            items.push(...rows.map((r) => ({
                id: Number(r.id),
                category: 'social',
                type: r.type,
                post_id: r.post_id ? Number(r.post_id) : null,
                title: r.title,
                message: r.message,
                is_read: Boolean(r.is_read),
                created_at: r.created_at,
                sender_handle: r.sender_callsign ? ('@' + r.sender_callsign) : null,
                sender_photo: this.resolveDefaultAvatar(r.sender_photo, r.sender_name, null, null),
                link: '/cms/broadcaster'
            })));
            const connRows = await this.dataSource.query(`SELECT uc.id, uc.status, uc.updated_at as created_at,
                        u.id as other_id, u.name as other_name, u.username as other_username, u.callsign as other_callsign, u.photo_url as other_photo
                 FROM user_connections uc
                 JOIN auth_users u ON u.id = CASE WHEN uc.requester_id = $1 THEN uc.addressee_id ELSE uc.requester_id END
                 WHERE ((uc.addressee_id = $1 AND uc.status = 'PENDING') OR (uc.requester_id = $1 AND uc.status = 'ACCEPTED'))
                 ORDER BY uc.updated_at DESC
                 LIMIT 15`, [uid]);
            items.push(...connRows.map((r) => {
                const handle = r.other_callsign || r.other_username || ('user_' + r.other_id);
                return {
                    id: 'conn_' + r.id,
                    category: 'social',
                    type: 'connection',
                    post_id: null,
                    title: 'Jejaring: ' + (r.other_name || handle),
                    message: r.status === 'PENDING' ? `Mengajukan koneksi dengan Anda (@${handle})` : `Anda sekarang terkoneksi dengan @${handle}`,
                    is_read: true,
                    created_at: r.created_at,
                    sender_handle: '@' + handle,
                    sender_photo: this.resolveDefaultAvatar(r.other_photo, r.other_name, null, null),
                    link: '/cms/profile'
                };
            }));
        }
        if (!cat || cat === 'dinas') {
            const dinasRows = await this.dataSource.query(`SELECT n.id, n.category, n.type, n.post_id, n.title, n.message, n.is_read, n.created_at,
                        u.name as sender_name, u.callsign as sender_callsign, u.photo_url as sender_photo
                 FROM bdb_social_notifications n
                 LEFT JOIN auth_users u ON u.id = n.sender_id
                 WHERE n.recipient_id = $1 AND n.category = 'dinas'
                 ORDER BY n.created_at DESC
                 LIMIT 15`, [uid]);
            items.push(...dinasRows.map((r) => ({
                id: Number(r.id),
                category: 'dinas',
                type: r.type,
                post_id: r.post_id ? Number(r.post_id) : null,
                title: r.title,
                message: r.message,
                is_read: Boolean(r.is_read),
                created_at: r.created_at,
                sender_handle: r.sender_callsign ? ('@' + r.sender_callsign) : null,
                sender_photo: this.resolveDefaultAvatar(r.sender_photo, r.sender_name, null, null),
                link: '/cms/broadcaster'
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
            data: items.slice(0, 30),
            unread_dinas: unreadDinas,
            unread_social: unreadSocial
        };
    }
    async markNotificationRead(user, notifId) {
        const uid = Number(user?.id);
        await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE id = $1 AND recipient_id = $2', [notifId, uid]);
        return { status: 1 };
    }
    async markAllNotificationsRead(user, category) {
        const uid = Number(user?.id);
        await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE recipient_id = $1 AND category = $2', [uid, category]);
        return { status: 1 };
    }
    async getDashboardWidgets(user) {
        const uid = Number(user?.id || 0);
        const jukrahRows = await this.dataSource.query(`SELECT p.id, p.content, p.created_at, s.nama_singkat as satker,
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
            satker: jukrahRows[0].satker || 'Robinopsnal Bareskrim Polri',
            created_at: jukrahRows[0].created_at,
            acknowledged: Boolean(jukrahRows[0].acknowledged)
        } : null;
        const trendingRows = await this.dataSource.query(`SELECT p.id, p.content, p.reaction_counts, p.created_at,
                    u.id as author_id, u.username as author_username, u.callsign, s.nama_singkat as satker,
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
            author_handle: this.formatCallsign(trendingRows[0].callsign, trendingRows[0].author_id, trendingRows[0].author_username),
            satker: this.isSuperUserOne(trendingRows[0].author_id, trendingRows[0].author_username, trendingRows[0].callsign)
                ? 'Robinopsnal Bareskrim Polri'
                : (trendingRows[0].satker || 'Polri'),
            comments_count: Number(trendingRows[0].comments_count || 0),
            reaction_counts: trendingRows[0].reaction_counts || {}
        } : null;
        const userStats = await this.dataSource.query(`SELECT 
                u.id, u.username, u.callsign,
                (SELECT COUNT(*)::int FROM bdb_social_posts WHERE author_id = $1 AND status = 'active') as my_posts,
                (SELECT COUNT(*)::int FROM bdb_social_notifications WHERE recipient_id = $1 AND is_read = false AND category = 'dinas') as unread_dinas
             FROM auth_users u WHERE u.id = $1`, [uid]);
        const quickStats = {
            callsign: this.formatCallsign(userStats[0]?.callsign, userStats[0]?.id, userStats[0]?.username),
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
    async uploadPdf(file) {
        if (!file)
            return null;
        if (file.mimetype !== 'application/pdf')
            throw new common_1.BadRequestException('Lampiran harus berupa file PDF.');
        const key = await this.minio.upload(file, 'jukrah');
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