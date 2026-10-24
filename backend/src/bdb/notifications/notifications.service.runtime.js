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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");

const ENTITY_LABEL = {
    social: 'Sebutan & Interaksi',
    koneksi: 'Koneksi Personil',
    satgas: 'Satgas Operasi',
    operasi: 'Operasi Kepolisian',
    kerma: 'Kerjasama (Kerma)',
    pelimpahan: 'Pelimpahan LP',
    kasus_atensi: 'Kasus Menonjol',
    jukrah: 'Pengumuman (Jukrah)'
};

const ALL_ENTITIES = [
    'social',
    'koneksi',
    'satgas',
    'operasi',
    'kerma',
    'pelimpahan',
    'kasus_atensi',
    'jukrah'
];

const ENTITY_LINK = {
    social: '/cms/broadcaster',
    koneksi: '/cms/profile',
    satgas: '/cms/master/operasi-satgas',
    operasi: '/cms/master/operasi-satgas',
    kerma: '/cms/master/kerma',
    pelimpahan: '/cms/laporan-polisi',
    kasus_atensi: '/cms/dashboard/main',
    jukrah: '/cms/pengumuman'
};

let NotificationsService = class NotificationsService {
    dataSource;
    ready = false;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async ensureTable() {
        if (this.ready)
            return;
        await this.dataSource.query(`
            create table if not exists bdb_notification_checkpoint (
                user_id bigint not null,
                entity text not null,
                last_seen_at timestamptz not null default now(),
                primary key (user_id, entity)
            )`);
        this.ready = true;
    }
    entitiesFor(authUser) {
        return ALL_ENTITIES;
    }
    async getCheckpoints(userId, entities) {
        await this.ensureTable();
        const rows = await this.dataSource.query('select entity, last_seen_at from bdb_notification_checkpoint where user_id=$1 and entity = any($2)', [userId, entities]);
        const map = new Map(rows.map((r) => [r.entity, new Date(r.last_seen_at)]));
        const missing = entities.filter((e) => !map.has(e));
        if (missing.length) {
            // Default initial checkpoint to 48 hours ago for new entities so recent events trigger alert
            const defaultSince = new Date(Date.now() - 48 * 3600 * 1000);
            for (const e of missing) {
                await this.dataSource.query('insert into bdb_notification_checkpoint (user_id, entity, last_seen_at) values ($1,$2,$3) on conflict (user_id, entity) do nothing', [userId, e, defaultSince]);
                map.set(e, defaultSince);
            }
        }
        return map;
    }
    async countNew(entity, since, authUser) {
        const userId = Number(authUser?.id || 0);
        const satkerId = Number(authUser?.scope_satker_id || 0);
        const role = String(authUser?.role_bdb || '').toLowerCase();
        const isAdmin = role === 'superadmin' || role === 'admin_binops';

        try {
            switch (entity) {
                case 'social': {
                    const r = await this.dataSource.query(
                        'SELECT count(*)::int as c FROM bdb_social_notifications WHERE recipient_id = $1 AND is_read = false',
                        [userId]
                    );
                    return Number(r[0]?.c || 0);
                }
                case 'koneksi': {
                    const r = await this.dataSource.query(
                        `SELECT count(*)::int as c FROM user_connections uc 
                         WHERE ((uc.addressee_id = $1 AND uc.status = 'PENDING') OR (uc.requester_id = $1 AND uc.status = 'ACCEPTED'))
                           AND uc.updated_at > $2`,
                        [userId, since]
                    );
                    return Number(r[0]?.c || 0);
                }
                case 'satgas': {
                    const r = await this.dataSource.query(
                        "SELECT count(*)::int as c FROM bdb_operasi_satgas WHERE deleted_at IS NULL AND jenis = 'SATGAS' AND created_at > $1",
                        [since]
                    );
                    return Number(r[0]?.c || 0);
                }
                case 'operasi': {
                    const r = await this.dataSource.query(
                        "SELECT count(*)::int as c FROM bdb_operasi_satgas WHERE deleted_at IS NULL AND jenis = 'OPERASI' AND created_at > $1",
                        [since]
                    );
                    return Number(r[0]?.c || 0);
                }
                case 'kerma': {
                    const r = await this.dataSource.query(
                        'SELECT count(*)::int as c FROM bdb_kerma_master WHERE deleted_at IS NULL AND created_at > $1',
                        [since]
                    );
                    return Number(r[0]?.c || 0);
                }
                case 'pelimpahan': {
                    if (isAdmin) {
                        const r = await this.dataSource.query(
                            'SELECT count(*)::int as c FROM bdb_lp_pelimpahan WHERE created_at > $1',
                            [since]
                        );
                        return Number(r[0]?.c || 0);
                    } else {
                        const r = await this.dataSource.query(
                            'SELECT count(*)::int as c FROM bdb_lp_pelimpahan WHERE (satker_tujuan_id = $2 OR satker_asal_id = $2) AND created_at > $1',
                            [since, satkerId]
                        );
                        return Number(r[0]?.c || 0);
                    }
                }
                case 'kasus_atensi': {
                    const r = await this.dataSource.query(
                        'SELECT count(*)::int as c FROM bdb_kasus_menonjol WHERE deleted_at IS NULL AND created_at > $1',
                        [since]
                    );
                    return Number(r[0]?.c || 0);
                }
                case 'jukrah': {
                    const r = await this.dataSource.query(
                        'SELECT count(*)::int as c FROM bdb_jukrah WHERE aktif = true AND tanggal_publish <= current_date AND created_at > $1',
                        [since]
                    );
                    return Number(r[0]?.c || 0);
                }
                default:
                    return 0;
            }
        } catch (e) {
            return 0;
        }
    }
    async fetchNew(entity, since, limit, authUser) {
        const userId = Number(authUser?.id || 0);
        const satkerId = Number(authUser?.scope_satker_id || 0);
        const role = String(authUser?.role_bdb || '').toLowerCase();
        const isAdmin = role === 'superadmin' || role === 'admin_binops';

        try {
            switch (entity) {
                case 'social': {
                    const rows = await this.dataSource.query(
                        'SELECT n.id, n.title, n.message, n.created_at, n.post_id FROM bdb_social_notifications n WHERE n.recipient_id = $1 AND n.is_read = false ORDER BY n.created_at DESC LIMIT $2',
                        [userId, limit]
                    );
                    return rows.map((r) => ({
                        id: r.id,
                        title: r.title || 'Sebutan & Interaksi',
                        message: r.message || 'Ada interaksi baru di linimasa',
                        created_at: r.created_at,
                        link: ENTITY_LINK.social
                    }));
                }
                case 'koneksi': {
                    const rows = await this.dataSource.query(
                        `SELECT uc.id, uc.status, uc.updated_at as created_at,
                                u.id as other_id, u.name as other_name, u.username as other_username, u.callsign as other_callsign
                         FROM user_connections uc
                         JOIN auth_users u ON u.id = CASE WHEN uc.requester_id = $1 THEN uc.addressee_id ELSE uc.requester_id END
                         WHERE ((uc.addressee_id = $1 AND uc.status = 'PENDING') OR (uc.requester_id = $1 AND uc.status = 'ACCEPTED'))
                           AND uc.updated_at > $2
                         ORDER BY uc.updated_at DESC LIMIT $3`,
                        [userId, since, limit]
                    );
                    return rows.map((r) => {
                        const targetHandle = r.other_callsign || r.other_username || ('user_' + r.other_id);
                        return {
                            id: r.id,
                            title: 'Personil: ' + (r.other_name || targetHandle),
                            message: r.status === 'PENDING' 
                                ? 'Mengajukan koneksi dengan Anda (@' + targetHandle + ')' 
                                : 'Anda sekarang terkoneksi dengan @' + targetHandle,
                            created_at: r.created_at,
                            link: ENTITY_LINK.koneksi
                        };
                    });
                }
                case 'satgas': {
                    const rows = await this.dataSource.query(
                        "SELECT id, nama as title, created_at FROM bdb_operasi_satgas WHERE deleted_at IS NULL AND jenis = 'SATGAS' AND created_at > $1 ORDER BY created_at DESC LIMIT $2",
                        [since, limit]
                    );
                    return rows.map((r) => ({
                        id: r.id,
                        title: r.title,
                        message: 'Ada Satgas Operasi Baru dari Robinops Bareskrim',
                        created_at: r.created_at,
                        link: ENTITY_LINK.satgas
                    }));
                }
                case 'operasi': {
                    const rows = await this.dataSource.query(
                        "SELECT id, nama as title, created_at FROM bdb_operasi_satgas WHERE deleted_at IS NULL AND jenis = 'OPERASI' AND created_at > $1 ORDER BY created_at DESC LIMIT $2",
                        [since, limit]
                    );
                    return rows.map((r) => ({
                        id: r.id,
                        title: r.title,
                        message: 'Ada Operasi Kepolisian Baru dari Bareskrim',
                        created_at: r.created_at,
                        link: ENTITY_LINK.operasi
                    }));
                }
                case 'kerma': {
                    const rows = await this.dataSource.query(
                        'SELECT id, institusi, tentang as title, created_at FROM bdb_kerma_master WHERE deleted_at IS NULL AND created_at > $1 ORDER BY created_at DESC LIMIT $2',
                        [since, limit]
                    );
                    return rows.map((r) => ({
                        id: r.id,
                        title: r.title,
                        message: 'Kerjasama (Kerma) Baru dengan ' + (r.institusi || 'Mitra'),
                        created_at: r.created_at,
                        link: ENTITY_LINK.kerma
                    }));
                }
                case 'pelimpahan': {
                    const sql = isAdmin
                        ? 'SELECT id, lp_id, satker_asal_nama, satker_tujuan_nama, created_at FROM bdb_lp_pelimpahan WHERE created_at > $1 ORDER BY created_at DESC LIMIT $2'
                        : 'SELECT id, lp_id, satker_asal_nama, satker_tujuan_nama, created_at FROM bdb_lp_pelimpahan WHERE (satker_tujuan_id = $3 OR satker_asal_id = $3) AND created_at > $1 ORDER BY created_at DESC LIMIT $2';
                    const params = isAdmin ? [since, limit] : [since, limit, satkerId];
                    const rows = await this.dataSource.query(sql, params);
                    return rows.map((r) => ({
                        id: r.id,
                        title: 'Pelimpahan ke ' + (r.satker_tujuan_nama || 'Satker Terkait'),
                        message: 'LP #' + r.lp_id + ' dilimpahkan dari ' + (r.satker_asal_nama || 'Satker Asal'),
                        created_at: r.created_at,
                        link: ENTITY_LINK.pelimpahan
                    }));
                }
                case 'kasus_atensi': {
                    const rows = await this.dataSource.query(
                        'SELECT id, judul as title, skala_viral, created_at FROM bdb_kasus_menonjol WHERE deleted_at IS NULL AND created_at > $1 ORDER BY created_at DESC LIMIT $2',
                        [since, limit]
                    );
                    return rows.map((r) => ({
                        id: r.id,
                        title: r.title,
                        message: 'Kasus Menonjol Baru (' + (r.skala_viral || 'Atensi Pimpinan') + ')',
                        created_at: r.created_at,
                        link: ENTITY_LINK.kasus_atensi
                    }));
                }
                case 'jukrah': {
                    const rows = await this.dataSource.query(
                        'SELECT id, nama as title, created_at FROM bdb_jukrah WHERE aktif = true AND tanggal_publish <= current_date AND created_at > $1 ORDER BY created_at DESC LIMIT $2',
                        [since, limit]
                    );
                    return rows.map((r) => ({
                        id: r.id,
                        title: r.title,
                        message: 'Ada Petunjuk Arah (Jukrah) Baru dari Robinops',
                        created_at: r.created_at,
                        link: ENTITY_LINK.jukrah
                    }));
                }
                default:
                    return [];
            }
        } catch (e) {
            return [];
        }
    }
    async summary(authUser) {
        const userId = Number(authUser?.id);
        const entities = this.entitiesFor(authUser);
        const checkpoints = await this.getCheckpoints(userId, entities);
        const perEntity = [];
        let total = 0;
        for (const e of entities) {
            const count = await this.countNew(e, checkpoints.get(e), authUser);
            perEntity.push({ entity: e, label: ENTITY_LABEL[e], count });
            total += count;
        }
        return { status: 1, data: { total, per_entity: perEntity } };
    }
    async list(authUser, limit = 20) {
        const userId = Number(authUser?.id);
        const entities = this.entitiesFor(authUser);
        const checkpoints = await this.getCheckpoints(userId, entities);
        const items = [];
        for (const e of entities) {
            const rows = await this.fetchNew(e, checkpoints.get(e), limit, authUser);
            for (const r of rows) {
                items.push({ entity: e, id: r.id, title: r.title, message: r.message, created_at: r.created_at, link: r.link });
            }
        }
        items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        // If items are empty (all caught up), populate with recent updates so dropdown is informative
        if (items.length === 0) {
            const fallbackSince = new Date(0);
            for (const e of ['satgas', 'kerma', 'kasus_atensi', 'koneksi']) {
                const rows = await this.fetchNew(e, fallbackSince, 2, authUser);
                for (const r of rows) {
                    items.push({ entity: e, id: r.id, title: r.title, message: r.message, created_at: r.created_at, link: r.link });
                }
            }
            items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        return { status: 1, data: items.slice(0, limit) };
    }
    async markSeen(authUser, entity) {
        const userId = Number(authUser?.id);
        await this.ensureTable();
        const entities = entity && ALL_ENTITIES.includes(entity) ? [entity] : this.entitiesFor(authUser);
        const now = new Date();
        for (const e of entities) {
            await this.dataSource.query(`insert into bdb_notification_checkpoint (user_id, entity, last_seen_at) values ($1,$2,$3)
                 on conflict (user_id, entity) do update set last_seen_at=$3`, [userId, e, now]);
        }
        if (!entity || entity === 'social') {
            await this.dataSource.query(
                'UPDATE bdb_social_notifications SET is_read = true WHERE recipient_id = $1 AND is_read = false',
                [userId]
            );
        }
        return { status: 1, message: 'Ditandai sudah dilihat.' };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map
