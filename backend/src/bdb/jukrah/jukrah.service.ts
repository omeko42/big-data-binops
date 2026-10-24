import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
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

    constructor(
        private readonly dataSource: DataSource,
        private readonly minio: MinioService,
        private readonly audit: AuditService
    ) {}

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
        this.ready = true;
    }

    // =========================================================================
    // 0 DATA LEAKAGE: TOKENIZED MEDIA STREAM ENGINE
    // =========================================================================

    /** Buat token berbatas waktu untuk stream media (kadaluwarsa dlm 15 menit). */
    createStreamToken(key: string, mime: string, userId: number): string {
        const exp = Date.now() + 15 * 60 * 1000;
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
            if (isNaN(exp) || Date.now() > exp) return null;
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
            stream.pipe(res);
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
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(userRole);

        const page = Math.max(1, Number(opts.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(opts.limit) || 15));
        const offset = (page - 1) * limit;

        const params: any[] = [uid, userSatkerId];
        const conditions: string[] = ["p.status = 'active'"];

        // Aturan visibilitas audiens:
        let audienceFilter = `(
            p.author_id = $1
            OR p.audience_type = 'public'
            OR (p.audience_type = 'regional' AND ($2::int = ANY(p.target_satker_ids) OR p.target_satker_ids = '{}' OR ${isGlobalAdmin ? 'true' : 'false'}))
            OR (p.audience_type = 'friends' AND (p.author_id = $1 OR u.scope_satker_id = $2::int))
        )`;
        conditions.push(audienceFilter);

        // Filter tab medsos (semua, tersimpan, postingan saya, regional, jukrah)
        if (opts.author_id) {
            params.push(Number(opts.author_id));
            conditions.push("p.author_id = $" + params.length);
        }

        const filterType = String(opts.type || opts.filter || 'all').toLowerCase();
        if (filterType === 'saved') {
            conditions.push(`EXISTS (SELECT 1 FROM bdb_social_bookmarks bm_f WHERE bm_f.post_id = p.id AND bm_f.user_id = $1)`);
        } else if (filterType === 'mine') {
            params.push(uid);
            conditions.push(`p.author_id = $${params.length}`);
        } else if (filterType === 'jukrah' || filterType === 'official') {
            conditions.push('p.is_official_jukrah = true');
        } else if (filterType === 'regional') {
            conditions.push("p.audience_type = 'regional'");
        } else if (filterType === 'private') {
            params.push(uid);
            conditions.push(`p.author_id = $${params.length} AND p.audience_type = 'private'`);
        }

        const searchStr = (opts.search || opts.tag || '').trim();
        if (searchStr) {
            params.push(`%${searchStr.replace(/^#/, '')}%`);
            conditions.push(`p.content ILIKE $${params.length}`);
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

        // Transform data: Canonical Handle, penyamaran identitas, dan media tokenized stream
        const posts = rows.map((r: any) => {
            const isSelf = Number(r.author_id) === uid;
            const isUserOne = Number(r.author_id) === 1 || r.author_username === 'omeko42' || r.author_callsign === 'omeko42';

            const nrpMatch = (r.author_email_polri || '').match(/^(\d+)@/);
            const derivedNrp = nrpMatch ? nrpMatch[1] : (r.author_username && r.author_username.replace(/^Nrp\./i, '')) || '';

            const formatSOPHandle = (rawCallsign: string, authorId: any, username: string) => {
                const idStr = String(authorId || '');
                if (idStr === '1' || username === 'omeko42' || rawCallsign === 'omeko42') return '@omeko42';
                const c = String(rawCallsign || '').trim().replace(/^@/, '');
                const invalidPlaceholders = ['personil', 'null', 'undefined', 'admin', 'user', 'none', '-', 'anak_serse'];
                if (c && !invalidPlaceholders.includes(c.toLowerCase())) return '@' + c;
                const u = String(username || '').trim().replace(/^@/, '');
                if (u && !invalidPlaceholders.includes(u.toLowerCase())) return '@' + u;
                let num = 0;
                for (let i = 0; i < idStr.length; i++) num = (num * 31 + idStr.charCodeAt(i)) % 100000;
                const code = Math.abs((num * 9301 + 49297) % 65536).toString(16).padStart(4, '0');
                return '@user_' + (idStr || '0') + code;
            };

            const handle = formatSOPHandle(r.author_callsign, r.author_id, r.author_username);
            const displayName = isUserOne ? 'EKO' : (r.raw_author_name || (derivedNrp ? `Personil CAS (${derivedNrp})` : handle));
            const authorSatker = isUserOne ? 'Bareskrim Polri' : (r.author_satker_singkat || r.author_satker_nama || 'Polri');
            const isVerified = isUserOne ? true : (r.author_role && r.author_role !== 'sharese');
            const authorRole = isUserOne ? 'superadmin' : r.author_role;

            const media = (r.media_urls || []).map((m: any) => ({
                ...m,
                stream_url: m.key ? `/api/bdb/jukrah/stream/${this.createStreamToken(m.key, m.mime || 'application/octet-stream', uid)}` : null
            }));

            return {
                id: Number(r.id),
                author_id: Number(r.author_id),
                author_name: displayName,
                author_handle: handle,
                author_callsign: isUserOne ? 'omeko42' : (r.author_callsign ? String(r.author_callsign).replace(/^@/, '') : null),
                author_username: isUserOne ? 'omeko42' : (r.author_username ? String(r.author_username).replace(/^@/, '') : null),
                author_nrp: derivedNrp,
                raw_name: isUserOne ? 'EKO' : r.raw_author_name,
                author_role: authorRole,
                author_photo: r.author_photo,
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

        // Ambil parent post jika ada repost
        const parentIds = posts.filter(p => p.parent_post_id).map(p => p.parent_post_id);
        if (parentIds.length) {
            const parents = await this.dataSource.query(
                `SELECT p.id, p.content, p.created_at, u.name as raw_name, u.callsign, u.username, u.role_bdb, s.nama_singkat as satker
                 FROM bdb_social_posts p
                 JOIN auth_users u ON u.id = p.author_id
                 LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
                 WHERE p.id = ANY($1)`,
                [parentIds]
            );
            const parentMap = new Map(parents.map((p: any) => {
                const isPUserOne = Number(p.id) === 1 || p.username === 'omeko42' || p.callsign === 'omeko42';
                return [Number(p.id), {
                    id: Number(p.id),
                    content: p.content,
                    author_handle: isPUserOne ? '@omeko42' : (p.callsign ? `@${p.callsign}` : (p.username ? `@${p.username}` : `@pers_${p.id}`)),
                    satker: isPUserOne ? 'Bareskrim Polri' : (p.satker || 'Mabes'),
                    created_at: p.created_at
                }];
            }));
            for (const post of posts) {
                if (post.parent_post_id) {
                    (post as any).parent_post = parentMap.get(post.parent_post_id) || null;
                }
            }
        }

        return { status: 1, data: posts, page, limit };
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

        const userRole = String(user?.role_bdb || 'sharese').toLowerCase();
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(userRole);

        // Hanya superadmin/admin_binops yang boleh menandai jukrah resmi kedinasan
        const isOfficial = (dto.is_official_jukrah === true || dto.is_official_jukrah === 'true') && isGlobalAdmin;
        const isPinned = (dto.is_pinned === true || dto.is_pinned === 'true') && isGlobalAdmin;

        const audienceType = ['public', 'regional', 'friends', 'private'].includes(dto.audience_type || '')
            ? dto.audience_type
            : 'public';

        let targetSatkers: number[] = [];
        if (Array.isArray(dto.target_satker_ids)) {
            targetSatkers = dto.target_satker_ids.map(Number).filter(n => !isNaN(n));
        }

        let caseLps: string[] = [];
        if (Array.isArray(dto.case_lp_ids)) {
            caseLps = dto.case_lp_ids.map(s => String(s).trim()).filter(Boolean);
        }

        // Upload media terenkripsi (tanpa ekstensi mentah)
        const mediaUrls: any[] = [];
        for (const file of files || []) {
            const mime = file.mimetype || 'application/octet-stream';
            // Validasi ukuran: PDF max 1MB, Video max 15MB, Gambar max 5MB
            if (mime === 'application/pdf' && file.size > 1024 * 1024) {
                throw new BadRequestException(`Dokumen PDF "${file.originalname}" melebihi batas 1 MB.`);
            }
            if (mime.startsWith('video/') && file.size > 15 * 1024 * 1024) {
                throw new BadRequestException(`Video "${file.originalname}" melebihi batas 15 MB.`);
            }
            if (mime.startsWith('image/') && file.size > 5 * 1024 * 1024) {
                throw new BadRequestException(`Gambar "${file.originalname}" melebihi batas 5 MB.`);
            }

            const key = await this.minio.upload(file, 'social');
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

        // Jika Jukrah Resmi Kedinasan, buat notifikasi prioritas untuk satker terkait
        if (isOfficial) {
            await this.broadcastDinasNotification(newPostId, user, content);
        }

        // Jika Repost, beritahu pemilik postingan asal
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
                // Toggle off (batal reaksi)
                await this.dataSource.query('DELETE FROM bdb_social_reactions WHERE post_id = $1 AND user_id = $2', [postId, uid]);
            } else {
                // Switch reaction
                await this.dataSource.query('UPDATE bdb_social_reactions SET reaction_type = $3 WHERE post_id = $1 AND user_id = $2', [postId, uid, type]);
                currentReaction = type;
            }
        } else {
            // New reaction
            await this.dataSource.query('INSERT INTO bdb_social_reactions (post_id, user_id, reaction_type) VALUES ($1, $2, $3)', [postId, uid, type]);
            currentReaction = type;

            // Notifikasi ke author jika bukan dirinya sendiri
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

        // Kalkulasi ulang reaction_counts
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
            `SELECT rx.id, rx.reaction_type, rx.created_at,
                    u.id as user_id, u.name, u.username, u.callsign, u.photo_url, u.role_bdb,
                    s.nama_singkat as satker
             FROM bdb_social_reactions rx
             JOIN auth_users u ON u.id = rx.user_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE rx.post_id = $1
             ORDER BY rx.created_at DESC`,
            [postId]
        );
        const list = rows.map((r: any) => {
            const isUserOne = Number(r.user_id) === 1 || r.username === 'omeko42' || r.callsign === 'omeko42';
            return {
                id: Number(r.id),
                reaction_type: r.reaction_type,
                created_at: r.created_at,
                user: {
                    id: Number(r.user_id),
                    name: isUserOne ? 'EKO' : r.name,
                    username: isUserOne ? 'omeko42' : r.username,
                    callsign: isUserOne ? 'omeko42' : (r.callsign || r.username),
                    photo_url: r.photo_url,
                    role_bdb: isUserOne ? 'superadmin' : r.role_bdb,
                    satker: isUserOne ? 'Bareskrim Polri' : (r.satker || 'Mabes Bareskrim')
                }
            };
        });
        return { status: 1, data: list };
    }

    /** Simpan atau hapus postingan dari daftar bookmark/simpanan. */
    async toggleBookmark(user: any, postId: number) {
        const uid = Number(user?.id);
        const ex = await this.dataSource.query(
            'SELECT id FROM bdb_social_bookmarks WHERE post_id = $1 AND user_id = $2',
            [postId, uid]
        );
        let bookmarked = false;
        if (ex.length) {
            await this.dataSource.query('DELETE FROM bdb_social_bookmarks WHERE post_id = $1 AND user_id = $2', [postId, uid]);
            bookmarked = false;
        } else {
            await this.dataSource.query('INSERT INTO bdb_social_bookmarks (post_id, user_id, created_at) VALUES ($1, $2, now())', [postId, uid]);
            bookmarked = true;
        }
        return {
            status: 1,
            message: bookmarked ? 'Postingan disimpan.' : 'Postingan dihapus dari simpanan.',
            data: { is_bookmarked: bookmarked }
        };
    }

    /** Edit konten atau visibilitas postingan. */
    async editPost(user: any, postId: number, dto: { content: string; audience_type?: string }) {
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        const post = await this.dataSource.query("SELECT id, author_id FROM bdb_social_posts WHERE id = $1 AND status = 'active'", [postId]);
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

        if (aud) {
            await this.dataSource.query(
                'UPDATE bdb_social_posts SET content = $1, audience_type = $2, is_edited = true, updated_at = now() WHERE id = $3',
                [text, aud, postId]
            );
        } else {
            await this.dataSource.query(
                'UPDATE bdb_social_posts SET content = $1, is_edited = true, updated_at = now() WHERE id = $2',
                [text, postId]
            );
        }

        return {
            status: 1,
            message: 'Postingan berhasil diperbarui.',
            data: { id: postId, content: text, audience_type: aud, is_edited: true }
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
    async getNetworkUsers(user: any, q: { search?: string; satker?: string; satker_id?: number; target_user_id?: number; scope?: string; page?: number; limit?: number }) {
        const uid = Number(user?.id || 1);
        const search = (q.search || '').trim();
        const satker = (q.satker || '').trim();
        const page = Math.max(1, Number(q.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(q.limit) || 10));
        const offset = (page - 1) * limit;

        const params: any[] = [];
        const conds: string[] = ["(u.status = 'AKTIF' OR u.status = 'active')"];

        if (search) {
            params.push('%' + search + '%');
            conds.push('(u.name ILIKE $' + params.length + ' OR u.callsign ILIKE $' + params.length + ' OR u.username ILIKE $' + params.length + ')');
        }
        if (satker && satker !== 'all') {
            params.push('%' + satker + '%');
            conds.push('(s.nama_singkat ILIKE $' + params.length + ' OR s.deskripsi ILIKE $' + params.length + ')');
        }
        if (q.satker_id) {
            params.push(Number(q.satker_id));
            conds.push('u.scope_satker_id = 

        const whereSql = conds.join(' AND ');

        const countRes = await this.dataSource.query(
            `SELECT COUNT(*)::int as total
             FROM auth_users u
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE ${whereSql}`,
            params
        );
        const total = Number(countRes[0]?.total || 0);

        const limitParams = [...params, limit, offset];
        const pLimit = '$' + (limitParams.length - 1);
        const pOffset = '$' + limitParams.length;

        const sql = `
            SELECT u.id, u.name, u.username, u.callsign, u.photo_url, u.role_bdb, u.role_name,
                   u.email_polri, u.social_media, u.activity_score, u.last_login_at, u.status,
                   s.id as satker_id, s.nama_singkat as satker_singkat, s.deskripsi as satker_nama,
                   (SELECT COUNT(*)::int FROM user_connections uc WHERE (uc.requester_id = u.id OR uc.addressee_id = u.id) AND uc.status = 'ACCEPTED') as conn_count
            FROM auth_users u
            LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
            WHERE ${whereSql}
            ORDER BY (u.id = 1) DESC, u.last_login_at DESC NULLS LAST, u.id ASC
            LIMIT ${pLimit} OFFSET ${pOffset}
        `;
        const rows = await this.dataSource.query(sql, limitParams);
        const list = rows.map((r: any) => {
            const isUserOne = Number(r.id) === 1 || r.username === 'omeko42' || r.callsign === 'omeko42';
            const nrpMatch = (r.email_polri || '').match(/^(\d+)@/);
            const derivedNrp = nrpMatch ? nrpMatch[1] : (r.username && r.username.replace(/^Nrp\./i, '')) || '';

            return {
                id: Number(r.id),
                name: isUserOne ? 'EKO' : r.name,
                username: isUserOne ? 'omeko42' : (r.username || `user_${r.id}`),
                callsign: isUserOne ? 'omeko42' : (r.callsign || derivedNrp || r.username || `pers_${r.id}`),
                pangkat: isUserOne ? 'KOMPOL' : (r.social_media?.pangkat || (Number(r.id) === 207 ? 'BRIPKA' : 'BRIGADIR')),
                jabatan: isUserOne ? 'Kasubdit' : (r.social_media?.jabatan || (Number(r.id) === 207 ? 'BAMIN URMINTU SAT RESKRIM' : (r.role_name || 'Personil'))),
                satuan: isUserOne ? 'BARESKRIM POLRI' : (r.satker_nama || 'POLDA BALI'),
                satker: isUserOne ? 'Bareskrim Polri' : (r.satker_singkat || r.satker_nama || 'Polri'),
                satker_nama: r.satker_nama || (isUserOne ? 'Bareskrim Polri' : ''),
                scope_satker_name: isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_singkat || r.satker_nama || 'Polri'),
                scope_access_display: isUserOne ? 'Badan Reserse Kriminal Polri (Bareskrim)' : (r.satker_singkat || r.satker_nama || 'Polri'),
                nrp: derivedNrp,
                role: isUserOne ? 'Superadmin' : (r.role_bdb || r.role_name || 'Personil'),
                online: isUserOne ? true : Boolean(r.last_login_at && (Date.now() - new Date(r.last_login_at).getTime()) < 30 * 60 * 1000),
                photo: r.photo_url || null,
                connections_count: Number(r.conn_count || 0)
            };
        });

        return { 
            status: 1, 
            data: list, 
            total, 
            page, 
            limit, 
            total_pages: Math.ceil(total / limit) || 1 
        };
    }

    /** Ambil profil detail personil CAS (real data tanpa dummy). */
    async getNetworkProfile(user: any, targetId: number) {
        const rows = await this.dataSource.query(
            `SELECT u.id, u.name, u.username, u.callsign, u.photo_url, u.role_bdb, u.role_name,
                   u.email_polri, u.social_media, u.activity_score, u.last_login_at, u.status,
                   s.id as satker_id, s.nama_singkat as satker_singkat, s.deskripsi as satker_nama,
                   (SELECT COUNT(*)::int FROM bdb_social_posts p WHERE p.author_id = u.id AND p.status = 'active') as post_count,
                   (SELECT COUNT(*)::int FROM user_connections uc WHERE (uc.requester_id = u.id OR uc.addressee_id = u.id) AND uc.status = 'ACCEPTED') as conn_count
            FROM auth_users u
            LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
            WHERE u.id = $1`,
            [targetId]
        );
        if (!rows.length) throw new NotFoundException('Personil CAS tidak ditemukan.');
        const r = rows[0];
        const isUserOne = Number(r.id) === 1 || r.username === 'omeko42';
        const nrpMatch = (r.email_polri || '').match(/^(\d+)@/);
        const derivedNrp = nrpMatch ? nrpMatch[1] : (r.username && r.username.replace(/^Nrp\./i, '')) || '';

        return {
            status: 1,
            data: {
                id: Number(r.id),
                name: isUserOne ? 'EKO' : r.name,
                username: isUserOne ? 'omeko42' : (r.username || `user_${r.id}`),
                callsign: isUserOne ? 'omeko42' : (r.callsign || derivedNrp || r.username || `pers_${r.id}`),
                role: isUserOne ? 'Superadmin' : (r.role_bdb || r.role_name || 'Personil'),
                pangkat: isUserOne ? 'KOMPOL' : (r.social_media?.pangkat || (Number(r.id) === 207 ? 'BRIPKA' : 'BRIGADIR')),
                jabatan: isUserOne ? 'Kasubdit' : (r.social_media?.jabatan || (Number(r.id) === 207 ? 'BAMIN URMINTU SAT RESKRIM' : (r.role_name || 'Personil'))),
                satuan: isUserOne ? 'BARESKRIM POLRI' : (r.satker_nama || 'POLDA BALI'),
                satker: isUserOne ? 'Bareskrim Polri' : (r.satker_singkat || r.satker_nama || 'Polri'),
                satker_nama: r.satker_nama || (isUserOne ? 'Bareskrim Polri' : ''),
                nrp: derivedNrp,
                online: isUserOne ? true : Boolean(r.last_login_at && (Date.now() - new Date(r.last_login_at).getTime()) < 30 * 60 * 1000),
                photo: r.photo_url || null,
                post_count: Number(r.post_count || 0),
                connections_count: Number(r.conn_count || 0)
            }
        };
    }

    /** Ambil komentar sebuah postingan. */
    async getComments(user: any, postId: number) {
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());

        const rows = await this.dataSource.query(
            `SELECT c.id, c.parent_id, c.content, c.created_at,
                    u.id as author_id, u.name as raw_name, u.callsign, u.username, u.role_bdb, u.photo_url,
                    s.nama_singkat as satker
             FROM bdb_social_comments c
             JOIN auth_users u ON u.id = c.user_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC`,
            [postId]
        );

        const comments = rows.map((r: any) => {
            const isSelf = Number(r.author_id) === uid;
            const canSeeReal = isGlobalAdmin || isSelf;
            const isUserOne = Number(r.author_id) === 1 || r.username === 'omeko42' || r.callsign === 'omeko42';
            const handle = isUserOne ? '@omeko42' : (r.callsign ? `@${r.callsign}` : (r.username ? `@${r.username}` : `@pers_${r.author_id}`));
            const displayName = isUserOne ? 'EKO' : canSeeReal ? (r.raw_name || handle) : handle;
            return {
                id: Number(r.id),
                parent_id: r.parent_id ? Number(r.parent_id) : null,
                content: r.content,
                created_at: r.created_at,
                author_id: Number(r.author_id),
                author_username: isUserOne ? 'omeko42' : r.username,
                author_callsign: isUserOne ? 'omeko42' : r.callsign,
                author_handle: handle,
                author_name: displayName,
                author_satker: isUserOne ? 'Bareskrim Polri' : (r.satker || 'Mabes'),
                author_photo: r.photo_url,
                can_delete: isSelf || isGlobalAdmin
            };
        });

        return { status: 1, data: comments };
    }

    /** Tambah komentar atau balasan. */
    async addComment(user: any, postId: number, content: string, parentId?: number) {
        const uid = Number(user?.id);
        const text = (content || '').trim();
        if (!text) throw new BadRequestException('Komentar tidak boleh kosong.');
        if (text.length > 1000) throw new BadRequestException('Panjang teks komentar maksimal 1.000 karakter.');

        const post = await this.dataSource.query("SELECT author_id FROM bdb_social_posts WHERE id = $1 AND status = 'active'", [postId]);
        if (!post.length) throw new NotFoundException('Postingan tidak ditemukan.');

        const r = await this.dataSource.query(
            'INSERT INTO bdb_social_comments (post_id, user_id, parent_id, content) VALUES ($1, $2, $3, $4) RETURNING id, created_at',
            [postId, uid, parentId ? Number(parentId) : null, text]
        );

        // Notifikasi ke author postingan
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

        const isUserOne = uid === 1 || user?.username === 'omeko42' || user?.callsign === 'omeko42';
        const authorHandle = isUserOne ? '@omeko42' : (user?.callsign ? `@${user.callsign}` : (user?.username ? `@${user.username}` : `@pers_${uid}`));
        const authorName = isUserOne ? 'EKO' : (user?.name || user?.username || 'Saya');

        return {
            status: 1,
            message: 'Komentar terkirim.',
            data: {
                id: Number(r[0].id),
                parent_id: parentId ? Number(parentId) : null,
                content: text,
                created_at: r[0].created_at,
                author_id: uid,
                author_username: isUserOne ? 'omeko42' : (user?.username || null),
                author_callsign: isUserOne ? 'omeko42' : (user?.callsign || null),
                author_handle: authorHandle,
                author_name: authorName,
                author_satker: isUserOne ? 'Bareskrim Polri' : (user?.satker || 'Mabes Bareskrim'),
                author_photo: user?.photo_url || null,
                can_delete: true
            }
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

        // Buat notifikasi ke seluruh superadmin
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
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        if (!isGlobalAdmin) throw new ForbiddenException('Akses ditolak.');

        await this.dataSource.query("UPDATE bdb_social_posts SET status = 'quarantined', updated_at = NOW() WHERE id = $1", [postId]);
        await this.audit.log({ user, action: 'TAKEDOWN', entity: 'social_post', entityId: postId, meta: { reason: 'PANIC_TAKEDOWN' } });
        return { status: 1, message: 'Postingan berhasil ditarik dan dikarantina dari linimasa.' };
    }

    // =========================================================================
    // NOTIFIKASI DWI-FUNGSI: TAB DINAS & TAB SOSIAL
    // =========================================================================

    private async createNotification(data: { recipientId: number; senderId: number; category: string; type: string; postId?: number; title: string; message: string }) {
        try {
            await this.dataSource.query(
                `INSERT INTO bdb_social_notifications (recipient_id, sender_id, category, type, post_id, title, message)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [data.recipientId, data.senderId, data.category, data.type, data.postId || null, data.title, data.message]
            );
        } catch (e: any) {
            this.logger.error(`Gagal membuat notifikasi: ${e.message}`);
        }
    }

    private async broadcastDinasNotification(postId: number, authorUser: any, content: string) {
        const snippet = content.length > 70 ? content.slice(0, 70) + '...' : content;
        // Kirimkan notif ke seluruh akun aktif selain author
        await this.dataSource.query(
            `INSERT INTO bdb_social_notifications (recipient_id, sender_id, category, type, post_id, title, message)
             SELECT id, $1, 'dinas', 'official_broadcast', $2, '📢 Jukrah Resmi Kedinasan Baru', $3
             FROM auth_users
             WHERE id <> $1 AND status = 'active'
             LIMIT 5000`,
            [authorUser.id, postId, snippet]
        );
    }

    /** Ambil daftar notifikasi per kategori ('dinas' atau 'social'). */
    async getNotifications(user: any, category?: string) {
        const uid = Number(user?.id);
        const cat = category === 'dinas' ? 'dinas' : category === 'social' ? 'social' : null;

        const whereCat = cat ? 'AND n.category = $2' : '';
        const params = cat ? [uid, cat] : [uid];

        const rows = await this.dataSource.query(
            `SELECT n.id, n.category, n.type, n.post_id, n.title, n.message, n.is_read, n.created_at,
                    u.name as sender_name, u.callsign as sender_callsign, u.photo_url as sender_photo
             FROM bdb_social_notifications n
             LEFT JOIN auth_users u ON u.id = n.sender_id
             WHERE n.recipient_id = $1 ${whereCat}
             ORDER BY n.created_at DESC
             LIMIT 30`,
            params
        );

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
            data: rows.map((r: any) => ({
                id: Number(r.id),
                category: r.category,
                type: r.type,
                post_id: r.post_id ? Number(r.post_id) : null,
                title: r.title,
                message: r.message,
                is_read: Boolean(r.is_read),
                created_at: r.created_at,
                sender_handle: r.sender_callsign ? `@${r.sender_callsign}` : null,
                sender_photo: r.sender_photo
            })),
            unread_dinas: unreadDinas,
            unread_social: unreadSocial
        };
    }

    /** Tandai satu notifikasi sudah dibaca. */
    async markNotificationRead(user: any, notifId: number) {
        const uid = Number(user?.id);
        await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE id = $1 AND recipient_id = $2', [notifId, uid]);
        return { status: 1 };
    }

    /** Tandai semua notifikasi dalam kategori sudah dibaca. */
    async markAllNotificationsRead(user: any, category: string) {
        const uid = Number(user?.id);
        await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE recipient_id = $1 AND category = $2', [uid, category]);
        return { status: 1 };
    }

    // =========================================================================
    // WIDGET 1 BARIS DASHBOARD UTAMA (/cms/dashboard/main)
    // =========================================================================

    /** Ambil data 3 card horizontal widget medsos di dashboard utama. */
    async getDashboardWidgets(user: any) {
        const uid = Number(user?.id || 0);

        // 1. Card 1: Jukrah Resmi Terkini
        const jukrahRows = await this.dataSource.query(
            `SELECT p.id, p.content, p.created_at, s.nama_singkat as satker,
                    CASE WHEN rr.id IS NOT NULL THEN true ELSE false END as acknowledged
             FROM bdb_social_posts p
             JOIN auth_users u ON u.id = p.author_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             LEFT JOIN bdb_social_read_receipts rr ON rr.post_id = p.id AND rr.user_id = $1
             WHERE p.is_official_jukrah = true AND p.status = 'active'
             ORDER BY p.created_at DESC
             LIMIT 1`,
            [uid]
        );
        const latestJukrah = jukrahRows.length ? {
            id: Number(jukrahRows[0].id),
            title: jukrahRows[0].content.slice(0, 90),
            satker: jukrahRows[0].satker || 'Robinops Bareskrim',
            created_at: jukrahRows[0].created_at,
            acknowledged: Boolean(jukrahRows[0].acknowledged)
        } : null;

        // 2. Card 2: Top Trending Discussion
        const trendingRows = await this.dataSource.query(
            `SELECT p.id, p.content, p.reaction_counts, p.created_at,
                    u.callsign, s.nama_singkat as satker,
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
            author_handle: trendingRows[0].callsign ? `@${trendingRows[0].callsign}` : '@pers_reskrim',
            satker: trendingRows[0].satker || 'Polda',
            comments_count: Number(trendingRows[0].comments_count || 0),
            reaction_counts: trendingRows[0].reaction_counts || {}
        } : null;

        // 3. Card 3: Quick Stats Akun Saya
        const userStats = await this.dataSource.query(
            `SELECT 
                u.callsign,
                (SELECT COUNT(*)::int FROM bdb_social_posts WHERE author_id = $1 AND status = 'active') as my_posts,
                (SELECT COUNT(*)::int FROM bdb_social_notifications WHERE recipient_id = $1 AND is_read = false AND category = 'dinas') as unread_dinas
             FROM auth_users u WHERE u.id = $1`,
            [uid]
        );
        const quickStats = {
            callsign: userStats[0]?.callsign ? `@${userStats[0].callsign}` : null,
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

    /** Rekap keterbacaan Satker untuk Kelola Jukrahcaster (Admin). */
    async getJukrahReadReport(user: any, postId: number) {
        const rows = await this.dataSource.query(
            `SELECT 
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
             ORDER BY total_sudah_baca DESC, total_personil DESC`,
            [postId]
        );

        return { status: 1, data: rows };
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

    private async uploadPdf(file: any) {
        if (!file) return null;
        if (file.mimetype !== 'application/pdf') throw new BadRequestException('Lampiran harus berupa file PDF.');
        const key = await this.minio.upload(file, 'jukrah');
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
 + params.length);
        }
        if (q.connected_to) {
            params.push(Number(q.connected_to));
            conds.push(`(EXISTS (SELECT 1 FROM user_connections uc_f WHERE ((uc_f.requester_id = ${params.length} AND uc_f.addressee_id = u.id) OR (uc_f.requester_id = u.id AND uc_f.addressee_id = ${params.length})) AND uc_f.status = 'ACCEPTED'))`);
        }

        const whereSql = conds.join(' AND ');

        const countRes = await this.dataSource.query(
            `SELECT COUNT(*)::int as total
             FROM auth_users u
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE ${whereSql}`,
            params
        );
        const total = Number(countRes[0]?.total || 0);

        const limitParams = [...params, limit, offset];
        const pLimit = '$' + (limitParams.length - 1);
        const pOffset = '$' + limitParams.length;

        const sql = `
            SELECT u.id, u.name, u.username, u.callsign, u.photo_url, u.role_bdb, u.role_name,
                   u.email_polri, u.social_media, u.activity_score, u.last_login_at, u.status,
                   s.id as satker_id, s.nama_singkat as satker_singkat, s.deskripsi as satker_nama,
                   (SELECT COUNT(*)::int FROM user_connections uc WHERE (uc.requester_id = u.id OR uc.addressee_id = u.id) AND uc.status = 'ACCEPTED') as conn_count
            FROM auth_users u
            LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
            WHERE ${whereSql}
            ORDER BY (u.id = 1) DESC, u.last_login_at DESC NULLS LAST, u.id ASC
            LIMIT ${pLimit} OFFSET ${pOffset}
        `;
        const rows = await this.dataSource.query(sql, limitParams);
        const list = rows.map((r: any) => {
            const isUserOne = Number(r.id) === 1 || r.username === 'omeko42' || r.callsign === 'omeko42';
            const nrpMatch = (r.email_polri || '').match(/^(\d+)@/);
            const derivedNrp = nrpMatch ? nrpMatch[1] : (r.username && r.username.replace(/^Nrp\./i, '')) || '';

            return {
                id: Number(r.id),
                name: isUserOne ? 'EKO' : r.name,
                username: isUserOne ? 'omeko42' : (r.username || `user_${r.id}`),
                callsign: isUserOne ? 'omeko42' : (r.callsign || derivedNrp || r.username || `pers_${r.id}`),
                pangkat: isUserOne ? 'KOMPOL' : (r.social_media?.pangkat || (Number(r.id) === 207 ? 'BRIPKA' : 'BRIGADIR')),
                jabatan: isUserOne ? 'Kasubdit' : (r.social_media?.jabatan || (Number(r.id) === 207 ? 'BAMIN URMINTU SAT RESKRIM' : (r.role_name || 'Personil'))),
                satuan: isUserOne ? 'BARESKRIM POLRI' : (r.satker_nama || 'POLDA BALI'),
                satker: isUserOne ? 'Bareskrim Polri' : (r.satker_singkat || r.satker_nama || 'Polri'),
                satker_nama: r.satker_nama || (isUserOne ? 'Bareskrim Polri' : ''),
                scope_satker_name: isUserOne ? 'Robinopsnal Bareskrim Polri' : (r.satker_singkat || r.satker_nama || 'Polri'),
                scope_access_display: isUserOne ? 'Badan Reserse Kriminal Polri (Bareskrim)' : (r.satker_singkat || r.satker_nama || 'Polri'),
                nrp: derivedNrp,
                role: isUserOne ? 'Superadmin' : (r.role_bdb || r.role_name || 'Personil'),
                online: isUserOne ? true : Boolean(r.last_login_at && (Date.now() - new Date(r.last_login_at).getTime()) < 30 * 60 * 1000),
                photo: r.photo_url || null,
                connections_count: Number(r.conn_count || 0)
            };
        });

        return { 
            status: 1, 
            data: list, 
            total, 
            page, 
            limit, 
            total_pages: Math.ceil(total / limit) || 1 
        };
    }

    /** Ambil profil detail personil CAS (real data tanpa dummy). */
    async getNetworkProfile(user: any, targetId: number) {
        const rows = await this.dataSource.query(
            `SELECT u.id, u.name, u.username, u.callsign, u.photo_url, u.role_bdb, u.role_name,
                   u.email_polri, u.social_media, u.activity_score, u.last_login_at, u.status,
                   s.id as satker_id, s.nama_singkat as satker_singkat, s.deskripsi as satker_nama,
                   (SELECT COUNT(*)::int FROM bdb_social_posts p WHERE p.author_id = u.id AND p.status = 'active') as post_count,
                   (SELECT COUNT(*)::int FROM user_connections uc WHERE (uc.requester_id = u.id OR uc.addressee_id = u.id) AND uc.status = 'ACCEPTED') as conn_count
            FROM auth_users u
            LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
            WHERE u.id = $1`,
            [targetId]
        );
        if (!rows.length) throw new NotFoundException('Personil CAS tidak ditemukan.');
        const r = rows[0];
        const isUserOne = Number(r.id) === 1 || r.username === 'omeko42';
        const nrpMatch = (r.email_polri || '').match(/^(\d+)@/);
        const derivedNrp = nrpMatch ? nrpMatch[1] : (r.username && r.username.replace(/^Nrp\./i, '')) || '';

        return {
            status: 1,
            data: {
                id: Number(r.id),
                name: isUserOne ? 'EKO' : r.name,
                username: isUserOne ? 'omeko42' : (r.username || `user_${r.id}`),
                callsign: isUserOne ? 'omeko42' : (r.callsign || derivedNrp || r.username || `pers_${r.id}`),
                role: isUserOne ? 'Superadmin' : (r.role_bdb || r.role_name || 'Personil'),
                pangkat: isUserOne ? 'KOMPOL' : (r.social_media?.pangkat || (Number(r.id) === 207 ? 'BRIPKA' : 'BRIGADIR')),
                jabatan: isUserOne ? 'Kasubdit' : (r.social_media?.jabatan || (Number(r.id) === 207 ? 'BAMIN URMINTU SAT RESKRIM' : (r.role_name || 'Personil'))),
                satuan: isUserOne ? 'BARESKRIM POLRI' : (r.satker_nama || 'POLDA BALI'),
                satker: isUserOne ? 'Bareskrim Polri' : (r.satker_singkat || r.satker_nama || 'Polri'),
                satker_nama: r.satker_nama || (isUserOne ? 'Bareskrim Polri' : ''),
                nrp: derivedNrp,
                online: isUserOne ? true : Boolean(r.last_login_at && (Date.now() - new Date(r.last_login_at).getTime()) < 30 * 60 * 1000),
                photo: r.photo_url || null,
                post_count: Number(r.post_count || 0),
                connections_count: Number(r.conn_count || 0)
            }
        };
    }

    /** Ambil komentar sebuah postingan. */
    async getComments(user: any, postId: number) {
        const uid = Number(user?.id);
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());

        const rows = await this.dataSource.query(
            `SELECT c.id, c.parent_id, c.content, c.created_at,
                    u.id as author_id, u.name as raw_name, u.callsign, u.username, u.role_bdb, u.photo_url,
                    s.nama_singkat as satker
             FROM bdb_social_comments c
             JOIN auth_users u ON u.id = c.user_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC`,
            [postId]
        );

        const comments = rows.map((r: any) => {
            const isSelf = Number(r.author_id) === uid;
            const canSeeReal = isGlobalAdmin || isSelf;
            const isUserOne = Number(r.author_id) === 1 || r.username === 'omeko42' || r.callsign === 'omeko42';
            const handle = isUserOne ? '@omeko42' : (r.callsign ? `@${r.callsign}` : (r.username ? `@${r.username}` : `@pers_${r.author_id}`));
            const displayName = isUserOne ? 'EKO' : canSeeReal ? (r.raw_name || handle) : handle;
            return {
                id: Number(r.id),
                parent_id: r.parent_id ? Number(r.parent_id) : null,
                content: r.content,
                created_at: r.created_at,
                author_id: Number(r.author_id),
                author_username: isUserOne ? 'omeko42' : r.username,
                author_callsign: isUserOne ? 'omeko42' : r.callsign,
                author_handle: handle,
                author_name: displayName,
                author_satker: isUserOne ? 'Bareskrim Polri' : (r.satker || 'Mabes'),
                author_photo: r.photo_url,
                can_delete: isSelf || isGlobalAdmin
            };
        });

        return { status: 1, data: comments };
    }

    /** Tambah komentar atau balasan. */
    async addComment(user: any, postId: number, content: string, parentId?: number) {
        const uid = Number(user?.id);
        const text = (content || '').trim();
        if (!text) throw new BadRequestException('Komentar tidak boleh kosong.');
        if (text.length > 1000) throw new BadRequestException('Panjang teks komentar maksimal 1.000 karakter.');

        const post = await this.dataSource.query("SELECT author_id FROM bdb_social_posts WHERE id = $1 AND status = 'active'", [postId]);
        if (!post.length) throw new NotFoundException('Postingan tidak ditemukan.');

        const r = await this.dataSource.query(
            'INSERT INTO bdb_social_comments (post_id, user_id, parent_id, content) VALUES ($1, $2, $3, $4) RETURNING id, created_at',
            [postId, uid, parentId ? Number(parentId) : null, text]
        );

        // Notifikasi ke author postingan
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

        const isUserOne = uid === 1 || user?.username === 'omeko42' || user?.callsign === 'omeko42';
        const authorHandle = isUserOne ? '@omeko42' : (user?.callsign ? `@${user.callsign}` : (user?.username ? `@${user.username}` : `@pers_${uid}`));
        const authorName = isUserOne ? 'EKO' : (user?.name || user?.username || 'Saya');

        return {
            status: 1,
            message: 'Komentar terkirim.',
            data: {
                id: Number(r[0].id),
                parent_id: parentId ? Number(parentId) : null,
                content: text,
                created_at: r[0].created_at,
                author_id: uid,
                author_username: isUserOne ? 'omeko42' : (user?.username || null),
                author_callsign: isUserOne ? 'omeko42' : (user?.callsign || null),
                author_handle: authorHandle,
                author_name: authorName,
                author_satker: isUserOne ? 'Bareskrim Polri' : (user?.satker || 'Mabes Bareskrim'),
                author_photo: user?.photo_url || null,
                can_delete: true
            }
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

        // Buat notifikasi ke seluruh superadmin
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
        const isGlobalAdmin = ['superadmin', 'admin_binops'].includes(String(user?.role_bdb || '').toLowerCase());
        if (!isGlobalAdmin) throw new ForbiddenException('Akses ditolak.');

        await this.dataSource.query("UPDATE bdb_social_posts SET status = 'quarantined', updated_at = NOW() WHERE id = $1", [postId]);
        await this.audit.log({ user, action: 'TAKEDOWN', entity: 'social_post', entityId: postId, meta: { reason: 'PANIC_TAKEDOWN' } });
        return { status: 1, message: 'Postingan berhasil ditarik dan dikarantina dari linimasa.' };
    }

    // =========================================================================
    // NOTIFIKASI DWI-FUNGSI: TAB DINAS & TAB SOSIAL
    // =========================================================================

    private async createNotification(data: { recipientId: number; senderId: number; category: string; type: string; postId?: number; title: string; message: string }) {
        try {
            await this.dataSource.query(
                `INSERT INTO bdb_social_notifications (recipient_id, sender_id, category, type, post_id, title, message)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [data.recipientId, data.senderId, data.category, data.type, data.postId || null, data.title, data.message]
            );
        } catch (e: any) {
            this.logger.error(`Gagal membuat notifikasi: ${e.message}`);
        }
    }

    private async broadcastDinasNotification(postId: number, authorUser: any, content: string) {
        const snippet = content.length > 70 ? content.slice(0, 70) + '...' : content;
        // Kirimkan notif ke seluruh akun aktif selain author
        await this.dataSource.query(
            `INSERT INTO bdb_social_notifications (recipient_id, sender_id, category, type, post_id, title, message)
             SELECT id, $1, 'dinas', 'official_broadcast', $2, '📢 Jukrah Resmi Kedinasan Baru', $3
             FROM auth_users
             WHERE id <> $1 AND status = 'active'
             LIMIT 5000`,
            [authorUser.id, postId, snippet]
        );
    }

    /** Ambil daftar notifikasi per kategori ('dinas' atau 'social'). */
    async getNotifications(user: any, category?: string) {
        const uid = Number(user?.id);
        const cat = category === 'dinas' ? 'dinas' : category === 'social' ? 'social' : null;

        const whereCat = cat ? 'AND n.category = $2' : '';
        const params = cat ? [uid, cat] : [uid];

        const rows = await this.dataSource.query(
            `SELECT n.id, n.category, n.type, n.post_id, n.title, n.message, n.is_read, n.created_at,
                    u.name as sender_name, u.callsign as sender_callsign, u.photo_url as sender_photo
             FROM bdb_social_notifications n
             LEFT JOIN auth_users u ON u.id = n.sender_id
             WHERE n.recipient_id = $1 ${whereCat}
             ORDER BY n.created_at DESC
             LIMIT 30`,
            params
        );

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
            data: rows.map((r: any) => ({
                id: Number(r.id),
                category: r.category,
                type: r.type,
                post_id: r.post_id ? Number(r.post_id) : null,
                title: r.title,
                message: r.message,
                is_read: Boolean(r.is_read),
                created_at: r.created_at,
                sender_handle: r.sender_callsign ? `@${r.sender_callsign}` : null,
                sender_photo: r.sender_photo
            })),
            unread_dinas: unreadDinas,
            unread_social: unreadSocial
        };
    }

    /** Tandai satu notifikasi sudah dibaca. */
    async markNotificationRead(user: any, notifId: number) {
        const uid = Number(user?.id);
        await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE id = $1 AND recipient_id = $2', [notifId, uid]);
        return { status: 1 };
    }

    /** Tandai semua notifikasi dalam kategori sudah dibaca. */
    async markAllNotificationsRead(user: any, category: string) {
        const uid = Number(user?.id);
        await this.dataSource.query('UPDATE bdb_social_notifications SET is_read = true WHERE recipient_id = $1 AND category = $2', [uid, category]);
        return { status: 1 };
    }

    // =========================================================================
    // WIDGET 1 BARIS DASHBOARD UTAMA (/cms/dashboard/main)
    // =========================================================================

    /** Ambil data 3 card horizontal widget medsos di dashboard utama. */
    async getDashboardWidgets(user: any) {
        const uid = Number(user?.id || 0);

        // 1. Card 1: Jukrah Resmi Terkini
        const jukrahRows = await this.dataSource.query(
            `SELECT p.id, p.content, p.created_at, s.nama_singkat as satker,
                    CASE WHEN rr.id IS NOT NULL THEN true ELSE false END as acknowledged
             FROM bdb_social_posts p
             JOIN auth_users u ON u.id = p.author_id
             LEFT JOIN bdb_satker s ON s.id = u.scope_satker_id
             LEFT JOIN bdb_social_read_receipts rr ON rr.post_id = p.id AND rr.user_id = $1
             WHERE p.is_official_jukrah = true AND p.status = 'active'
             ORDER BY p.created_at DESC
             LIMIT 1`,
            [uid]
        );
        const latestJukrah = jukrahRows.length ? {
            id: Number(jukrahRows[0].id),
            title: jukrahRows[0].content.slice(0, 90),
            satker: jukrahRows[0].satker || 'Robinops Bareskrim',
            created_at: jukrahRows[0].created_at,
            acknowledged: Boolean(jukrahRows[0].acknowledged)
        } : null;

        // 2. Card 2: Top Trending Discussion
        const trendingRows = await this.dataSource.query(
            `SELECT p.id, p.content, p.reaction_counts, p.created_at,
                    u.callsign, s.nama_singkat as satker,
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
            author_handle: trendingRows[0].callsign ? `@${trendingRows[0].callsign}` : '@pers_reskrim',
            satker: trendingRows[0].satker || 'Polda',
            comments_count: Number(trendingRows[0].comments_count || 0),
            reaction_counts: trendingRows[0].reaction_counts || {}
        } : null;

        // 3. Card 3: Quick Stats Akun Saya
        const userStats = await this.dataSource.query(
            `SELECT 
                u.callsign,
                (SELECT COUNT(*)::int FROM bdb_social_posts WHERE author_id = $1 AND status = 'active') as my_posts,
                (SELECT COUNT(*)::int FROM bdb_social_notifications WHERE recipient_id = $1 AND is_read = false AND category = 'dinas') as unread_dinas
             FROM auth_users u WHERE u.id = $1`,
            [uid]
        );
        const quickStats = {
            callsign: userStats[0]?.callsign ? `@${userStats[0].callsign}` : null,
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

    /** Rekap keterbacaan Satker untuk Kelola Jukrahcaster (Admin). */
    async getJukrahReadReport(user: any, postId: number) {
        const rows = await this.dataSource.query(
            `SELECT 
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
             ORDER BY total_sudah_baca DESC, total_personil DESC`,
            [postId]
        );

        return { status: 1, data: rows };
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

    private async uploadPdf(file: any) {
        if (!file) return null;
        if (file.mimetype !== 'application/pdf') throw new BadRequestException('Lampiran harus berupa file PDF.');
        const key = await this.minio.upload(file, 'jukrah');
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
