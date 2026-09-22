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
 * Akses operasional baca/tulis hanya untuk pemilik penanganan yang ditetapkan.
 * DORS menentukan alamat tujuan, termasuk unit Narkoba/PPA-PPO/Reskrim.
 * Hierarki induk-anak digunakan untuk rekap, bukan untuk mengambil alih seluruh LP Polsek.
 * Guard superadmin/admin tetap berada pada resolveScope di pemanggil.
 */
export async function operationalLpScopeIds(dataSource: DataSource, rootId: number): Promise<number[]> {
    const id = Number(rootId);
    if (!Number.isSafeInteger(id) || id <= 0) return [];
    const rows = await dataSource.query('select id from bdb_satker where id=$1', [id]);
    return rows.map((row: any) => Number(row.id)).filter((value: number) => value === id);
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

