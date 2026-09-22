import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export type NotifEntity = 'jukrah' | 'satgas' | 'operasi';
const ENTITY_LABEL: Record<NotifEntity, string> = { jukrah: 'Pengumuman', satgas: 'Satgas', operasi: 'Operasi' };
const ALL_ENTITIES: NotifEntity[] = ['jukrah', 'satgas', 'operasi'];
const ENTITY_LINK: Record<NotifEntity, string> = { jukrah: '/cms/pengumuman', satgas: '/cms/master/operasi-satgas', operasi: '/cms/master/operasi-satgas' };

/**
 * Notifikasi topbar: "Ada X Baru dari Robinops Bareskrim Polri" utk Pengumuman (Jukrah), Satgas,
 * dan Operasi. Bukan tabel per-item (spt bdb_jukrah_view) -- cukup 1 checkpoint "terakhir dilihat"
 * per user per jenis, krn yg dibutuhkan cuma "ada yg baru sejak terakhir dibuka", bukan status
 * baca per-item individual.
 */
@Injectable()
export class NotificationsService {
    private ready = false;
    constructor(private readonly dataSource: DataSource) {}

    private async ensureTable() {
        if (this.ready) return;
        await this.dataSource.query(`
            create table if not exists bdb_notification_checkpoint (
                user_id bigint not null,
                entity text not null,
                last_seen_at timestamptz not null default now(),
                primary key (user_id, entity)
            )`);
        this.ready = true;
    }

    /** Satgas/Operasi cuma utk role admin (menu-nya pun ADMIN-only) -- Pengumuman utk semua role. */
    private entitiesFor(authUser: any): NotifEntity[] {
        const role = String(authUser?.role_bdb || '').toLowerCase();
        const isAdmin = role === 'superadmin' || role === 'admin_binops';
        return isAdmin ? ALL_ENTITIES : ['jukrah'];
    }

    /** Checkpoint per user+entity -- kalau belum ada, dibuat dgn now() supaya backlog lama tak
     *  langsung dianggap "baru semua" pas fitur ini baru rilis; hanya item SETELAH ini yg menotifikasi. */
    private async getCheckpoints(userId: number, entities: NotifEntity[]): Promise<Map<NotifEntity, Date>> {
        await this.ensureTable();
        const rows = await this.dataSource.query('select entity, last_seen_at from bdb_notification_checkpoint where user_id=$1 and entity = any($2)', [userId, entities]);
        const map = new Map<NotifEntity, Date>(rows.map((r: any) => [r.entity as NotifEntity, r.last_seen_at]));
        const missing = entities.filter((e) => !map.has(e));
        if (missing.length) {
            const now = new Date();
            for (const e of missing) {
                await this.dataSource.query('insert into bdb_notification_checkpoint (user_id, entity, last_seen_at) values ($1,$2,$3) on conflict (user_id, entity) do nothing', [userId, e, now]);
                map.set(e, now);
            }
        }
        return map;
    }

    private async countNew(entity: NotifEntity, since: Date): Promise<number> {
        if (entity === 'jukrah') {
            // bdb_jukrah dibuat lazy oleh JukrahService.ensureTable() saat fitur Jukrah pertama
            // diakses -- di deploy fresh, belum tentu tabelnya sudah ada. 42P01 = undefined_table.
            try {
                const r = await this.dataSource.query(`select count(*)::int c from bdb_jukrah where aktif=true and tanggal_publish <= current_date and created_at > $1`, [since]);
                return r[0]?.c || 0;
            } catch (e: any) {
                if (e?.code === '42P01') return 0;
                throw e;
            }
        }
        const jenis = entity === 'satgas' ? 'SATGAS' : 'OPERASI';
        const r = await this.dataSource.query(`select count(*)::int c from bdb_operasi_satgas where deleted_at is null and jenis=$1 and created_at > $2`, [jenis, since]);
        return r[0]?.c || 0;
    }

    private async fetchNew(entity: NotifEntity, since: Date, limit: number): Promise<{ id: number; title: string; created_at: string }[]> {
        if (entity === 'jukrah') {
            try {
                return await this.dataSource.query(
                    `select id, nama as title, created_at from bdb_jukrah
                     where aktif=true and tanggal_publish <= current_date and created_at > $1
                     order by created_at desc limit $2`,
                    [since, limit]
                );
            } catch (e: any) {
                if (e?.code === '42P01') return [];
                throw e;
            }
        }
        const jenis = entity === 'satgas' ? 'SATGAS' : 'OPERASI';
        return this.dataSource.query(
            `select id, nama as title, created_at from bdb_operasi_satgas
             where deleted_at is null and jenis=$1 and created_at > $2
             order by created_at desc limit $3`,
            [jenis, since, limit]
        );
    }

    /** Ringkasan (badge angka topbar) -- jumlah item baru per jenis sejak terakhir ditandai dilihat. */
    async summary(authUser: any) {
        const userId = Number(authUser?.id);
        const entities = this.entitiesFor(authUser);
        const checkpoints = await this.getCheckpoints(userId, entities);
        const perEntity: { entity: NotifEntity; label: string; count: number }[] = [];
        let total = 0;
        for (const e of entities) {
            const count = await this.countNew(e, checkpoints.get(e)!);
            perEntity.push({ entity: e, label: ENTITY_LABEL[e], count });
            total += count;
        }
        return { status: 1, data: { total, per_entity: perEntity } };
    }

    /** Daftar item baru (dropdown notifikasi), gabungan semua jenis, terbaru dulu. */
    async list(authUser: any, limit = 20) {
        const userId = Number(authUser?.id);
        const entities = this.entitiesFor(authUser);
        const checkpoints = await this.getCheckpoints(userId, entities);
        const items: { entity: NotifEntity; id: number; title: string; message: string; created_at: string; link: string }[] = [];
        for (const e of entities) {
            const rows = await this.fetchNew(e, checkpoints.get(e)!, limit);
            for (const r of rows) {
                items.push({ entity: e, id: r.id, title: r.title, message: `Ada ${ENTITY_LABEL[e]} Baru dari Robinops Bareskrim Polri`, created_at: r.created_at, link: ENTITY_LINK[e] });
            }
        }
        items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return { status: 1, data: items.slice(0, limit) };
    }

    /** Tandai sudah dilihat (semua jenis, atau 1 jenis tertentu) -- dipanggil saat dropdown notifikasi dibuka. */
    async markSeen(authUser: any, entity?: string) {
        const userId = Number(authUser?.id);
        await this.ensureTable();
        const entities: NotifEntity[] = entity && (ALL_ENTITIES as string[]).includes(entity) ? [entity as NotifEntity] : this.entitiesFor(authUser);
        const now = new Date();
        for (const e of entities) {
            await this.dataSource.query(
                `insert into bdb_notification_checkpoint (user_id, entity, last_seen_at) values ($1,$2,$3)
                 on conflict (user_id, entity) do update set last_seen_at=$3`,
                [userId, e, now]
            );
        }
        return { status: 1, message: 'Ditandai sudah dilihat.' };
    }
}
