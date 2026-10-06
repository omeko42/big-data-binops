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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JukrahService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const minio_service_1 = require("../kerma/minio.service");
const audit_service_1 = require("../audit/audit.service");
const crypto = require("crypto");
let JukrahService = class JukrahService {
    dataSource;
    minio;
    audit;
    logger = new common_1.Logger('JukrahService');
    ready = false;
    streamSecret = process.env.JWT_SECRET || 'cas_stream_token_key_2026_bareskrim';
    constructor(dataSource, minio, audit) {
        this.dataSource = dataSource;
        this.minio = minio;
        this.audit = audit;
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
        this.ready = true;
    }
    createStreamToken(key, mime, userId) {
        const exp = Date.now() + 15 * 60 * 1000;
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
            if (isNaN(exp) || Date.now() > exp)
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
            res.setHeader('Content-Disposition', 'inline');
            stream.pipe(res);
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
        const limit = Math.min(50, Math.max(1, Number(opts.limit) || 15));
        const offset = (page - 1) * limit;
        const params = [uid, userSatkerId];
        const conditions = ["p.status = 'active'"];
        let audienceFilter = "(p.author_id = $1 OR p.audience_type = 'public' OR (p.audience_type = 'regional' AND ($2 = ANY(p.target_satker_ids) OR p.target_satker_ids = '{}' OR " + (isGlobalAdmin ? 'true' : 'false') + ")) OR (p.audience_type = 'friends' AND (p.author_id = $1 OR u.scope_satker_id = $2)))";
        conditions.push(audienceFilter);

        const effectiveFilter = String(opts.filter || opts.type || 'all').toLowerCase();
        if (effectiveFilter === 'mine') {
            params.push(uid);
            conditions.push("p.author_id = $" + params.length);
        } else if (effectiveFilter === 'saved' || effectiveFilter === 'bookmarks') {
            conditions.push("bm.id IS NOT NULL");
        } else if (effectiveFilter === 'jukrah' || effectiveFilter === 'official') {
            conditions.push('p.is_official_jukrah = true');
        } else if (effectiveFilter === 'regional') {
            conditions.push("p.audience_type = 'regional'");
        } else if (effectiveFilter === 'friends') {
            conditions.push("p.audience_type = 'friends'");
        } else if (effectiveFilter === 'private') {
            params.push(uid);
            conditions.push("p.author_id = $" + params.length + " AND p.audience_type = 'private'");
        }

        const effectiveSearch = (opts.search || opts.tag || '').trim();
        if (effectiveSearch) {
            params.push('%' + effectiveSearch.replace(/^#/, '') + '%');
            conditions.push('(p.content ILIKE $' + params.length + ' OR u.name ILIKE $' + params.length + ' OR u.callsign ILIKE $' + params.length + ')');
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
                CASE WHEN bm.id IS NOT NULL THEN true ELSE false END as is_bookmarked,
                p.parent_post_id,
                p.created_at,
                p.updated_at,
                u.name as raw_author_name,
                u.callsign as author_callsign,
                u.username as author_username,
                u.role_bdb as author_role,
                u.photo_url as author_photo,
                u.scope_satker_id as author_satker_id,
                s.deskripsi as author_satker_nama,
                s.nama_singkat as author_satker_singkat,
                rx.reaction_type as my_reaction,
                CASE WHEN rr.id IS NOT NULL THEN true ELSE false END as my_acknowledged,
                (SELECT COUNT(*)::int FROM bdb_social_comments c WHERE c.post_id = p.id) as comments_count
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
            const canSeeRealName = isGlobalAdmin || isSelf;
            const handle = this.formatCallsign(r.author_callsign, r.author_id, r.author_username);
            const displayName = canSeeRealName ? (r.raw_author_name || handle) : handle;
            const isVerified = r.author_role && r.author_role !== 'sharese';
            const media = (r.media_urls || []).map((m) => ({
                ...m,
                stream_url: m.key ? `/api/bdb/jukrah/stream/${this.createStreamToken(m.key, m.mime || 'application/octet-stream', uid)}` : null
            }));
            return {
                id: Number(r.id),
                author_id: Number(r.author_id),
                author_name: displayName,
                author_handle: handle,
                raw_name: canSeeRealName ? r.raw_author_name : null,
                author_role: r.author_role,
                author_photo: r.author_photo,
                author_satker: r.author_satker_singkat || r.author_satker_nama || 'Mabes Bareskrim',
                author_callsign: (handle.startsWith('@') ? handle.slice(1) : handle),
                author_username: (handle.startsWith('@') ? handle.slice(1) : handle),
                author_photo_url: r.author_photo || null,
                satker: r.author_satker_singkat || r.author_satker_nama || 'Mabes Bareskrim',
                satker_name: r.author_satker_nama || r.author_satker_singkat || 'Mabes Bareskrim',
                is_verified: isVerified,
                audience_type: r.audience_type,
                target_satker_ids: r.target_satker_ids,
                content: r.content,
                media,
                case_lp_ids: r.case_lp_ids || [],
                reaction_counts: r.reaction_counts || { like: 0, respect: 0, insightful: 0, applause: 0, fire: 0 },
                total_reactions: Object.values(r.reaction_counts || {}).reduce((s, v) => s + Number(v || 0), 0),
                repost_count: Number(r.repost_count || 0),
                view_count: Number(r.view_count || 0),
                is_official_jukrah: Boolean(r.is_official_jukrah),
                is_pinned: Boolean(r.is_pinned),
                parent_post_id: r.parent_post_id ? Number(r.parent_post_id) : null,
                my_reaction: r.my_reaction || null,
                user_reaction: r.my_reaction || null,
                my_acknowledged: Boolean(r.my_acknowledged),
                comments_count: Number(r.comments_count || 0),
                is_bookmarked: Boolean(r.is_bookmarked),
                is_edited: Boolean(r.is_edited),
                can_edit: isSelf || isGlobalAdmin,
                created_at: r.created_at,
                updated_at: r.updated_at,
                can_delete: isSelf || isGlobalAdmin,
                can_modify_visibility: isSelf
            };
        });
        const parentIds = posts.filter(p => p.parent_post_id).map(p => p.parent_post_id);
        if (parentIds.length) {
            const parents = await this.dataSource.query(`SELECT p.id, p.content, p.created_at, u.name as raw_name, u.callsign, u.role_bdb, s.nama_singkat as satker
                 FROM bdb_social_posts p
                 JOIN auth_users u ON u.id = p.author_id
                 LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
                 WHERE p.id = ANY($1)`, [parentIds]);
            const parentMap = new Map(parents.map((p) => [Number(p.id), {
                    id: Number(p.id),
                    content: p.content,
                    author_handle: this.formatCallsign(p.callsign, p.id, p.username),
                    satker: p.satker || 'Mabes',
                    created_at: p.created_at
                }]));
            for (const post of posts) {
                if (post.parent_post_id) {
                    post.parent_post = parentMap.get(post.parent_post_id) || null;
                }
            }
        }
        return { status: 1, data: posts, page, limit };
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
        // Scan for @mentions in post content
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
                        title: 'Sebutan Baru (Mention)',
                        message: `Seseorang menyebut Anda dalam sebuah postingan: "${content.slice(0, 75)}..."`
                    });
                }
            } catch (err) {
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
        counts.forEach((c) => { newCounts[c.reaction_type] = Number(c.c); });
        await this.dataSource.query('UPDATE bdb_social_posts SET reaction_counts = $2 WHERE id = $1', [postId, JSON.stringify(newCounts)]);
        const total = Object.values(newCounts).reduce((s, v) => s + Number(v || 0), 0);
        return { status: 1, data: { my_reaction: currentReaction, user_reaction: currentReaction, reaction_counts: newCounts, total_reactions: total } };
    }
    async getComments(user, postId) {
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        const rows = await this.dataSource.query(`SELECT c.id, c.parent_id, c.content, c.created_at,
                    u.id as author_id, u.name as raw_name, u.callsign, u.username, u.role_bdb, u.photo_url,
                    s.nama_singkat as satker
             FROM bdb_social_comments c
             JOIN auth_users u ON u.id = c.user_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC`, [postId]);
        const comments = rows.map((r) => {
            const isSelf = Number(r.author_id) === uid;
            const canSeeReal = isGlobalAdmin || isSelf;
            const handle = this.formatCallsign(r.callsign, r.author_id, r.username);
            return {
                id: Number(r.id),
                parent_id: r.parent_id ? Number(r.parent_id) : null,
                content: r.content,
                created_at: r.created_at,
                author_id: Number(r.author_id),
                author_handle: handle,
                author_callsign: (handle.startsWith('@') ? handle.slice(1) : handle),
                author_username: r.username || (handle.startsWith('@') ? handle.slice(1) : handle),
                author_role: r.role_bdb,
                author_name: canSeeReal ? (r.raw_name || handle) : handle,
                author_satker: r.satker || 'Mabes',
                author_photo: r.photo_url,
                can_delete: isSelf || isGlobalAdmin
            };
        });
        return { status: 1, data: comments };
    }
    async addComment(user, postId, content, parentId) {
        const uid = Number(user?.id);
        const text = (content || '').trim();
        if (!text)
            throw new common_1.BadRequestException('Komentar tidak boleh kosong.');
        const post = await this.dataSource.query('SELECT author_id FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!post.length)
            throw new common_1.NotFoundException('Postingan tidak ditemukan.');
        const r = await this.dataSource.query('INSERT INTO bdb_social_comments (post_id, user_id, parent_id, content) VALUES ($1, $2, $3, $4) RETURNING id, created_at', [postId, uid, parentId ? Number(parentId) : null, text]);
        // Scan for @mentions in comment text
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
                        title: 'Sebutan Baru di Komentar',
                        message: `Seseorang menyebut Anda dalam sebuah komentar: "${text.slice(0, 75)}..."`
                    });
                }
            } catch (err) {
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
        return { status: 1, message: 'Komentar terkirim.', data: { id: Number(r[0].id), created_at: r[0].created_at } };
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
        return { status: 1, message: 'Konfirmasi keterbacaan tercatat.' };
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

        let items = [];

        if (!cat || cat === 'social') {
            // Social notifications (reactions, comments, mentions)
            const rows = await this.dataSource.query(
                `SELECT n.id, n.category, n.type, n.post_id, n.title, n.message, n.is_read, n.created_at,
                        u.name as sender_name, u.callsign as sender_callsign, u.photo_url as sender_photo
                 FROM bdb_social_notifications n
                 LEFT JOIN auth_users u ON u.id = n.sender_id
                 WHERE n.recipient_id = $1 AND n.category = 'social'
                 ORDER BY n.created_at DESC
                 LIMIT 25`,
                [uid]
            );
            items.push(...rows.map(r => ({
                id: Number(r.id),
                category: 'social',
                type: r.type,
                post_id: r.post_id ? Number(r.post_id) : null,
                title: r.title,
                message: r.message,
                is_read: Boolean(r.is_read),
                created_at: r.created_at,
                sender_handle: r.sender_callsign ? ('@' + r.sender_callsign) : null,
                sender_photo: r.sender_photo,
                link: '/cms/broadcaster'
            })));

            // Connections
            const connRows = await this.dataSource.query(
                `SELECT uc.id, uc.status, uc.updated_at as created_at,
                        u.id as other_id, u.name as other_name, u.username as other_username, u.callsign as other_callsign, u.photo_url as other_photo
                 FROM user_connections uc
                 JOIN auth_users u ON u.id = CASE WHEN uc.requester_id = $1 THEN uc.addressee_id ELSE uc.requester_id END
                 WHERE ((uc.addressee_id = $1 AND uc.status = 'PENDING') OR (uc.requester_id = $1 AND uc.status = 'ACCEPTED'))
                 ORDER BY uc.updated_at DESC
                 LIMIT 15`,
                [uid]
            );
            items.push(...connRows.map(r => {
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
                    sender_photo: r.other_photo,
                    link: '/cms/profile'
                };
            }));
        }

        if (!cat || cat === 'dinas') {
            // Official dinas broadcasts from bdb_social_notifications
            const dinasRows = await this.dataSource.query(
                `SELECT n.id, n.category, n.type, n.post_id, n.title, n.message, n.is_read, n.created_at,
                        u.name as sender_name, u.callsign as sender_callsign, u.photo_url as sender_photo
                 FROM bdb_social_notifications n
                 LEFT JOIN auth_users u ON u.id = n.sender_id
                 WHERE n.recipient_id = $1 AND n.category = 'dinas'
                 ORDER BY n.created_at DESC
                 LIMIT 15`,
                [uid]
            );
            items.push(...dinasRows.map(r => ({
                id: Number(r.id),
                category: 'dinas',
                type: r.type,
                post_id: r.post_id ? Number(r.post_id) : null,
                title: r.title,
                message: r.message,
                is_read: Boolean(r.is_read),
                created_at: r.created_at,
                sender_handle: r.sender_callsign ? ('@' + r.sender_callsign) : null,
                sender_photo: r.sender_photo,
                link: '/cms/broadcaster'
            })));

            // Satgas & Operasi
            const satgasRows = await this.dataSource.query(
                `SELECT id, jenis, nama as title, deskripsi, created_at
                 FROM bdb_operasi_satgas
                 WHERE deleted_at IS NULL
                 ORDER BY created_at DESC
                 LIMIT 6`
            );
            items.push(...satgasRows.map(r => ({
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

            // Kerma Baru
            const kermaRows = await this.dataSource.query(
                `SELECT id, institusi, tentang as title, created_at
                 FROM bdb_kerma_master
                 WHERE deleted_at IS NULL
                 ORDER BY created_at DESC
                 LIMIT 5`
            );
            items.push(...kermaRows.map(r => ({
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

            // Pelimpahan LP
            const lpSql = isAdmin
                ? `SELECT id, lp_id, satker_asal_nama, satker_tujuan_nama, created_at FROM bdb_lp_pelimpahan ORDER BY created_at DESC LIMIT 6`
                : `SELECT id, lp_id, satker_asal_nama, satker_tujuan_nama, created_at FROM bdb_lp_pelimpahan WHERE (satker_tujuan_id = $1 OR satker_asal_id = $1) ORDER BY created_at DESC LIMIT 6`;
            const lpParams = isAdmin ? [] : [satkerId];
            const lpRows = await this.dataSource.query(lpSql, lpParams);
            items.push(...lpRows.map(r => ({
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

        // Sort combined items newest first
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
        unreadCounts.forEach(r => {
            if (r.category === 'dinas') unreadDinas = Number(r.c);
            if (r.category === 'social') unreadSocial = Number(r.c);
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
    formatCallsign(rawCallsign, authorId, username) {
        const idStr = String(authorId || '');
        if (idStr === '1' || username === 'omeko11' || rawCallsign === 'omeko11') return '@omeko11';
        let c = String(rawCallsign || '').trim().replace(/^@/, '');
        if (c.startsWith('pers_') || (c.startsWith('user_') && !/^[a-zA-Z0-9_]{15,}$/.test(c))) c = '';
        const invalidPlaceholders = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-'];
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
        const seed = idStr || 'polri';
        let num = 0;
        for (let i = 0; i < seed.length; i++) num = (num * 31 + seed.charCodeAt(i)) % 100000;
        const code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
        return '@user_' + (idStr || '0') + code;
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
            satker: jukrahRows[0].satker || 'Robinops Bareskrim',
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
            satker: trendingRows[0].satker || 'Polda',
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

    async getNetworkUsers(user, opts) {
        const uid = Number(user?.id || 0);
        const limit = Math.min(100, Math.max(1, Number(opts.limit) || 30));
        const search = (opts.search || '').trim();
        let whereClauses = ["u.status = 'AKTIF'"];
        let params = [];
        if (search) {
            params.push('%' + search + '%');
            whereClauses.push('(u.name ILIKE $' + params.length + ' OR u.username ILIKE $' + params.length + ' OR u.email_polri ILIKE $' + params.length + ' OR s.deskripsi ILIKE $' + params.length + ')');
        }
        if (opts.satker_id) {
            params.push(opts.satker_id);
            whereClauses.push('u.scope_satker_id = $' + params.length);
        }
        const countRes = await this.dataSource.query(
            'SELECT count(*)::int as total FROM auth_users u LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id WHERE ' + whereClauses.join(' AND '),
            params
        );
        const total = countRes[0]?.total || 0;
        params.push(limit);
        const sql = 'SELECT u.id, u.name, u.username, u.callsign, u.email, u.email_polri, u.role_bdb, u.photo_url, u.last_login_at, u.scope_satker_id, u.scope_satker_key, s.deskripsi as satker_nama, s.nama_singkat as satker_singkat, tp.pangkat, tp.nrp, tp.satuan, tp.no_hp FROM auth_users u LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id LEFT JOIN trb_police tp ON (lower(tp.email) = lower(u.email) OR (u.email_polri IS NOT NULL AND lower(tp.email) = lower(u.email_polri))) WHERE ' + whereClauses.join(' AND ') + ' ORDER BY u.last_login_at DESC NULLS LAST, u.id ASC LIMIT $' + params.length;
        const rows = await this.dataSource.query(sql, params);
        const isSuperadmin = String(user?.role_bdb || '').toLowerCase() === 'superadmin';
        const data = rows.map((r) => {
            const nrpFallback = r.email && r.email.match(/^(\d{7,10})@/) ? r.email.match(/^(\d{7,10})@/)[1] : (r.email_polri && r.email_polri.match(/^(\d{7,10})@/) ? r.email_polri.match(/^(\d{7,10})@/)[1] : null);
            return {
                id: Number(r.id),
                name: r.name,
                callsign: r.callsign || r.username || (r.email_polri ? r.email_polri.split('@')[0] : (r.email ? r.email.split('@')[0] : 'personil_' + r.id)),
                username: r.username,
                email: r.email,
                email_polri: r.email_polri || (r.email && r.email.endsWith('@polri.go.id') ? r.email : null),
                role_bdb: r.role_bdb,
                satker_nama: r.satker_nama || (r.role_bdb === 'superadmin' ? 'Mabes Bareskrim' : (r.satuan || 'Polri')),
                satker_singkat: r.satker_singkat || r.satker_nama || 'Polri',
                pangkat: r.pangkat || (['superadmin', 'admin_binops'].includes(String(r.role_bdb||'').toLowerCase()) ? 'Superadmin' : 'Personil Polri'),
                nrp: r.nrp || nrpFallback,
                no_hp: r.no_hp || null,
                photo_url: r.photo_url,
                is_connected: isSuperadmin || Number(r.id) === uid,
                last_login_at: r.last_login_at
            };
        });
        return { status: 1, data, total, is_superadmin: isSuperadmin };
    }
    
    async getReactions(user, postId) {
        const rows = await this.dataSource.query(`
            SELECT 
                r.id,
                r.reaction_type,
                r.created_at,
                u.id as user_id,
                u.name,
                u.username,
                u.callsign,
                u.photo_url,
                u.role_bdb,
                s.deskripsi as satker_nama,
                p.pangkat,
                p.nrp
            FROM bdb_social_reactions r
            JOIN auth_users u ON u.id = r.user_id
            LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
            LEFT JOIN trb_police p ON (lower(p.email) = lower(u.email) OR (u.email_polri IS NOT NULL AND lower(p.email) = lower(u.email_polri)))
            WHERE r.post_id = $1
            ORDER BY r.created_at DESC
        `, [postId]);
        return {
            status: 1,
            data: rows.map(r => ({
                id: r.id,
                reaction_type: r.reaction_type,
                created_at: r.created_at,
                user: {
                    id: Number(r.user_id),
                    name: r.name,
                    username: r.username,
                    callsign: r.callsign || r.username || 'personil',
                    photo_url: r.photo_url,
                    role_bdb: r.role_bdb,
                    satker: r.satker_nama || 'Bareskrim Polri',
                    pangkat: r.pangkat || (['superadmin', 'admin_binops'].includes(String(r.role_bdb||'').toLowerCase()) ? 'Superadmin' : 'Personil Polri'),
                    nrp: r.nrp
                }
            }))
        };
    }
    async toggleBookmark(user, postId) {
        const uid = Number(user?.id);
        if (!uid) throw new common_1.ForbiddenException('Sesi tidak valid');
        const ex = await this.dataSource.query('SELECT id FROM bdb_social_bookmarks WHERE post_id = $1 AND user_id = $2', [postId, uid]);
        let bookmarked = false;
        if (ex.length) {
            await this.dataSource.query('DELETE FROM bdb_social_bookmarks WHERE post_id = $1 AND user_id = $2', [postId, uid]);
            bookmarked = false;
        } else {
            await this.dataSource.query('INSERT INTO bdb_social_bookmarks (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [postId, uid]);
            bookmarked = true;
        }
        return { status: 1, data: { bookmarked, post_id: postId } };
    }
    async editPost(user, postId, dto) {
        const uid = Number(user?.id);
        const post = await this.dataSource.query('SELECT id, author_id FROM bdb_social_posts WHERE id = $1', [postId]);
        if (!post.length) throw new common_1.NotFoundException('Postingan tidak ditemukan');
        const isAuthor = Number(post[0].author_id) === uid;
        const isSuperadmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        if (!isAuthor && !isSuperadmin) throw new common_1.ForbiddenException('Hanya pengarang yang dapat mengedit postingan');
        const content = (dto.content || '').trim();
        if (!content) throw new common_1.BadRequestException('Konten tidak boleh kosong');
        const audienceType = ['public', 'regional', 'friends', 'private'].includes(dto.audience_type || '') ? dto.audience_type : undefined;
        let updateQuery = 'UPDATE bdb_social_posts SET content = $1, is_edited = true, updated_at = NOW()';
        const params = [content];
        if (audienceType) {
            params.push(audienceType);
            updateQuery += ', audience_type = $' + params.length;
        }
        params.push(postId);
        updateQuery += ' WHERE id = $' + params.length + ' RETURNING *';
        const res = await this.dataSource.query(updateQuery, params);
        return { status: 1, data: res[0] };
    }

    async getNetworkProfile(user, targetId) {
        const cleanTarget = String(targetId || '').replace(/^@/, '').trim();
        let targetUid = null;
        if (/^\d+$/.test(cleanTarget)) {
            targetUid = Number(cleanTarget);
        } else if (/^user_(\d+)/i.test(cleanTarget)) {
            targetUid = Number(cleanTarget.match(/^user_(\d+)/i)[1]);
        }

        let sql = 'SELECT u.id, u.name, u.username, u.callsign, u.email, u.email_polri, u.role_bdb, u.photo_url, u.status, u.last_login_at, u.social_media, u.scope_satker_id, u.scope_satker_key, s.deskripsi as satker_nama FROM auth_users u LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id ';
        let params = [];
        if (targetUid) {
            sql += 'WHERE u.id = $1 LIMIT 1';
            params = [targetUid];
        } else {
            sql += 'WHERE lower(u.username) = $1 OR lower(u.callsign) = $1 LIMIT 1';
            params = [cleanTarget.toLowerCase()];
        }
        const uRes = await this.dataSource.query(sql, params);
        if (!uRes || !uRes.length) throw new common_1.NotFoundException('Personil tidak ditemukan');
        const target = uRes[0];
        let policeProfile = null;
        try {
            const pRes = await this.dataSource.query(
                'SELECT nrp, nama, satuan, no_hp, pangkat, jabatan, foto, is_pns, social_media FROM trb_police WHERE lower(email) = any($1::text[]) LIMIT 1',
                [[target.email, target.email_polri].filter(Boolean)]
            );
            if (pRes && pRes.length) policeProfile = pRes[0];
        } catch(e) {}
        return {
            status: 1,
            data: {
                id: Number(target.id),
                name: target.name,
                username: target.username,
                callsign: target.callsign || target.username || (target.email_polri ? target.email_polri.split('@')[0] : (target.email ? target.email.split('@')[0] : 'personil')),
                nrp: policeProfile?.nrp || (target.email && target.email.match(/^(\d{7,10})@/) ? target.email.match(/^(\d{7,10})@/)[1] : (target.email_polri && target.email_polri.match(/^(\d{7,10})@/) ? target.email_polri.match(/^(\d{7,10})@/)[1] : null)),
                pangkat: policeProfile?.pangkat || (['superadmin', 'admin_binops'].includes(String(target.role_bdb||'').toLowerCase()) ? 'Superadmin' : 'Personil Polri'),
                jabatan: policeProfile?.jabatan || target.role_bdb,
                satuan: policeProfile?.satuan || target.satker_nama || 'Bareskrim Polri',
                satker_nama: target.satker_nama || 'Mabes Bareskrim',
                email_polri: target.email_polri || (target.email && target.email.endsWith('@polri.go.id') ? target.email : null),
                email: target.email,
                no_hp: policeProfile?.no_hp || null,
                photo_url: target.photo_url || policeProfile?.foto || null,
                role_bdb: target.role_bdb,
                social_media: target.social_media || policeProfile?.social_media || {},
                last_login_at: target.last_login_at
            }
        };
    }
};
exports.JukrahService = JukrahService;
exports.JukrahService = JukrahService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        minio_service_1.MinioService,
        audit_service_1.AuditService])
], JukrahService);
//# sourceMappingURL=jukrah.service.js.map
