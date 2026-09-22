import { DataSource } from 'typeorm';

export type EffectiveLpOwner = {
    satker_id?: number | string | null;
    unit_satker_id?: number | string | null;
};

/** Unit fungsional adalah owner efektif bila tersedia; jika tidak, gunakan satker induknya. */
export function effectiveLpOwnerId(lp: EffectiveLpOwner | null | undefined): number | null {
    if (!lp) return null;
    const raw = lp.unit_satker_id ?? lp.satker_id;
    if (raw === null || raw === undefined || raw === '') return null;
    const id = Number(raw);
    return Number.isFinite(id) ? id : null;
}

export function hasEffectiveLpAccess(lp: EffectiveLpOwner | null | undefined, scopeSatkerId: number | null | undefined): boolean {
    if (scopeSatkerId === null || scopeSatkerId === undefined) return false;
    return effectiveLpOwnerId(lp) === Number(scopeSatkerId);
}

export function effectiveLpScopeSql(alias: string, parameter: string): string {
    return `coalesce(${alias}.unit_satker_id, ${alias}.satker_id) = ${parameter}`;
}

/**
 * Scope operasional terkontrol:
 * - operator biasa: hanya satker/unitnya sendiri;
 * - SAT RESKRIM di bawah Polres: dirinya + POLSEK + UNIT/RESKRIM POLSEK di bawah Polres yang sama.
 *
 * Fungsi saudara (Narkoba, PPA-PPO, Lantas, dst.) tidak pernah ikut. Query ini dipakai bersama
 * oleh jalur baca dan tulis agar aturan tidak berbeda antar modul.
 */
export async function operationalLpScopeIds(dataSource: DataSource, rootId: number): Promise<number[]> {
    const rows = await dataSource.query(
        `with recursive root as (
            select id, parent_id, deskripsi
              from bdb_satker
             where id=$1
         ), polres as (
            select p.id
              from root r
              join bdb_satker p on p.id=r.parent_id
             where upper(trim(r.deskripsi)) like 'SAT RESKRIM%'
               and (upper(coalesce(p.tipe_satker,'')) in ('POLRES','POLRESTA','POLRESTABES','POLRES METRO')
                    or upper(trim(p.deskripsi)) like 'POLRES%')
         ), territory as (
            select c.id, c.parent_id, c.deskripsi, c.tipe_satker
              from bdb_satker c join polres p on c.parent_id=p.id
            union all
            select c.id, c.parent_id, c.deskripsi, c.tipe_satker
              from bdb_satker c join territory t on c.parent_id=t.id
         ), allowed as (
            select id from root
            union
            select t.id
              from territory t
              left join bdb_satker parent on parent.id=t.parent_id
             where upper(coalesce(t.tipe_satker,''))='POLSEK'
                or upper(trim(t.deskripsi)) like 'POLSEK%'
                or ((upper(coalesce(parent.tipe_satker,''))='POLSEK' or upper(trim(parent.deskripsi)) like 'POLSEK%')
                    and (upper(trim(t.deskripsi)) like 'UNIT RESKRIM%' or upper(trim(t.deskripsi)) like 'RESKRIM POLSEK%'))
         )
         select id from allowed order by id`,
        [rootId]
    );
    return rows.map((row: any) => Number(row.id)).filter(Number.isFinite);
}

export async function hasOperationalLpAccess(
    dataSource: DataSource,
    lp: EffectiveLpOwner | null | undefined,
    scopeSatkerId: number | null | undefined
): Promise<boolean> {
    if (scopeSatkerId === null || scopeSatkerId === undefined) return false;
    const ownerId = effectiveLpOwnerId(lp);
    if (ownerId === null) return false;
    const allowedIds = await operationalLpScopeIds(dataSource, Number(scopeSatkerId));
    return allowedIds.includes(ownerId);
}
