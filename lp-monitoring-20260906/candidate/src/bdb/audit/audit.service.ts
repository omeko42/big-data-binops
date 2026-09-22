import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export type AuditEntry = {
    user?: any; // objek req.user (punya id, name) — opsional
    userId?: number;
    userName?: string;
    action: string; // mis. VIEW, CREATE, UPDATE, DELETE, LOGIN
    entity?: string; // mis. jukrah, dokumen, laporan_polisi
    entityId?: number | string;
    meta?: any; // detail tambahan (json)
    ip?: string;
    outcome?: 'SUCCESS' | 'ERROR'; // dipakai halaman Log Audit utk filter cepat error sistem
};

/** Audit log GENERAL — dipakai lintas fitur. Panggil `audit.log({...})` dari service mana pun. */
@Injectable()
export class AuditService {
    private ready = false;
    constructor(private readonly dataSource: DataSource) {}

    async ensureTable() {
        if (this.ready) return;
        await this.dataSource.query(`
            create table if not exists bdb_audit_log (
                id bigserial primary key,
                user_id bigint,
                user_nama text,
                action text not null,
                entity text,
                entity_id text,
                meta jsonb,
                ip text,
                created_at timestamptz not null default now()
            )`);
        // self-healing bila tabel dibuat versi lama (tanpa ip / entity_id bigint)
        await this.dataSource.query('alter table bdb_audit_log add column if not exists ip text');
        await this.dataSource.query('alter table bdb_audit_log alter column entity_id type text using entity_id::text');
        await this.dataSource.query('alter table bdb_audit_log add column if not exists outcome text');
        await this.dataSource.query('create index if not exists idx_audit_entity on bdb_audit_log(entity, entity_id)');
        await this.dataSource.query('create index if not exists idx_audit_created on bdb_audit_log(created_at desc)');
        await this.dataSource.query('create index if not exists idx_audit_outcome on bdb_audit_log(outcome)');
        this.ready = true;
    }

    /** Catat satu aktivitas. Tidak pernah melempar error (audit tak boleh menggagalkan aksi utama). */
    async log(entry: AuditEntry): Promise<void> {
        try {
            await this.ensureTable();
            const uid = entry.userId ?? entry.user?.id ?? null;
            let uname = entry.userName ?? entry.user?.name ?? null;
            if (!uname && uid) {
                const actor = await this.dataSource.query('select name from auth_users where id=$1', [uid]);
                uname = actor[0]?.name || null;
            }
            await this.dataSource.query(
                'insert into bdb_audit_log (user_id, user_nama, action, entity, entity_id, meta, ip, outcome) values ($1,$2,$3,$4,$5,$6,$7,$8)',
                [uid, uname, entry.action, entry.entity ?? null, entry.entityId != null ? String(entry.entityId) : null, entry.meta ? JSON.stringify(entry.meta) : null, entry.ip ?? null, entry.outcome ?? null]
            );
        } catch {
            /* jangan gagalkan aksi utama hanya karena audit gagal */
        }
    }

    /** Daftar log (admin) — filter action/entity/outcome/pencarian + paginasi. */
    async list(opts: { search?: string; action?: string; entity?: string; outcome?: string; userId?: number | string; page?: number | string; row?: number | string }) {
        await this.ensureTable();
        const page = Math.max(1, Number(opts.page) || 1);
        const row = Math.max(1, Math.min(1000, Number(opts.row) || 25));
        const offset = (page - 1) * row;
        const params: any[] = [];
        const wh: string[] = [];
        if (opts.search && opts.search.trim()) {
            params.push(`%${opts.search.trim()}%`);
            wh.push(`(user_nama ilike $${params.length} or action ilike $${params.length} or entity ilike $${params.length} or meta::text ilike $${params.length})`);
        }
        if (opts.action) {
            params.push(opts.action);
            wh.push(`action=$${params.length}`);
        }
        if (opts.entity) {
            params.push(opts.entity);
            wh.push(`entity=$${params.length}`);
        }
        if (opts.outcome) {
            params.push(opts.outcome);
            wh.push(`outcome=$${params.length}`);
        }
        if (opts.userId) {
            params.push(Number(opts.userId));
            wh.push(`user_id=$${params.length}`);
        }
        const where = wh.length ? 'where ' + wh.join(' and ') : '';
        const totalRow = await this.dataSource.query(`select count(*)::int c from bdb_audit_log ${where}`, params);
        const total = totalRow[0]?.c || 0;
        params.push(row, offset);
        const rows = await this.dataSource.query(
            `select id, user_id, user_nama, action, entity, entity_id, meta, ip, outcome, created_at
             from bdb_audit_log ${where} order by created_at desc, id desc limit $${params.length - 1} offset $${params.length}`,
            params
        );
        return { status: 1, data: rows, total, page, row, total_page: Math.ceil(total / row) };
    }

    /** Nilai distinct untuk dropdown filter. */
    async filters() {
        await this.ensureTable();
        const actions = await this.dataSource.query('select distinct action from bdb_audit_log order by 1');
        const entities = await this.dataSource.query("select distinct entity from bdb_audit_log where entity is not null order by 1");
        return { status: 1, data: { actions: actions.map((a: any) => a.action), entities: entities.map((e: any) => e.entity) } };
    }
}
