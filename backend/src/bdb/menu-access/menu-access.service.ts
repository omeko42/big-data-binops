import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuditService } from '../audit/audit.service';

const KNOWN_ROLES = ['superadmin', 'admin_binops', 'operator', 'viewer', 'sharese', 'testing'];
const DISALLOWED_LEGACY_ROLES = new Set(['pejabat', 'analis', 'admin']);

/** Pemetaan akses menu per role (override defaultRoles yang ada di katalog frontend). */
@Injectable()
export class MenuAccessService {
    private ready = false;
    constructor(
        private readonly dataSource: DataSource,
        private readonly audit: AuditService
    ) {}

    private async ensureTable() {
        if (this.ready) return;
        await this.dataSource.query(`
            create table if not exists bdb_menu_role_access (
                id bigserial primary key,
                role text not null,
                menu_key text not null,
                allowed boolean not null default true,
                updated_at timestamptz not null default now(),
                unique (role, menu_key)
            )`);
        this.ready = true;
    }

    private async roles(): Promise<string[]> {
        const [userRows, orgRoleRows] = await Promise.all([
            this.dataSource.query("select distinct lower(role_bdb) as role from auth_users where role_bdb is not null and role_bdb <> '' order by 1"),
            this.dataSource.query("select lower(role_name) as role from tm_org_role where role_name is not null and role_name <> '' and deleted_at is null")
        ]);
        const fromUsers = userRows.map((r: any) => r.role).filter((r: string) => r && !DISALLOWED_LEGACY_ROLES.has(r));
        const fromOrgRole = orgRoleRows.map((r: any) => r.role).filter((r: string) => r && !DISALLOWED_LEGACY_ROLES.has(r));
        const set = new Set<string>([...fromOrgRole, ...KNOWN_ROLES, ...fromUsers]);
        return Array.from(set);
    }

    async get() {
        await this.ensureTable();
        const roles = await this.roles();
        const overrides = await this.dataSource.query('select role, menu_key, allowed from bdb_menu_role_access');
        return { status: 1, data: { roles, overrides } };
    }

    async save(user: any, body: any) {
        await this.ensureTable();
        const role = String(body?.role || '').trim().toLowerCase();
        const menuKey = String(body?.menu_key || '').trim();
        if (!role || !menuKey) throw new BadRequestException('role & menu_key wajib.');
        if (role === 'superadmin') throw new BadRequestException('Akses superadmin tidak dapat diubah (selalu penuh).');
        const allowed = !(body?.allowed === false || body?.allowed === 'false');
        await this.dataSource.query(
            `insert into bdb_menu_role_access (role, menu_key, allowed) values ($1,$2,$3)
             on conflict (role, menu_key) do update set allowed=excluded.allowed, updated_at=now()`,
            [role, menuKey, allowed]
        );
        await this.audit.log({ user, action: 'UPDATE', entity: 'menu_access', entityId: `${role}:${menuKey}`, meta: { role, menu_key: menuKey, allowed } });
        return { status: 1, message: 'Akses menu diperbarui.' };
    }
}
