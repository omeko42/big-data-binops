export type LpOwnershipRow = {
    satker_id?: unknown;
    unit_satker_id?: unknown;
};

/**
 * LP yang sudah dipetakan ke unit tetap menyimpan satker teritorial pada satker_id.
 * Karena itu unit_satker_id adalah pemilik akses efektif bila terisi; satker_id hanya
 * menjadi fallback untuk LP teritorial atau data lama yang belum memiliki unit.
 */
export function effectiveLpOwnerId(lp: LpOwnershipRow | null | undefined): number | null {
    if (!lp) return null;
    const raw = lp.unit_satker_id ?? lp.satker_id;
    if (raw === null || raw === undefined || raw === '') return null;
    const id = Number(raw);
    return Number.isFinite(id) ? id : null;
}

export function hasEffectiveLpAccess(lp: LpOwnershipRow | null | undefined, scopeSatkerId: number | null | undefined): boolean {
    if (scopeSatkerId === null || scopeSatkerId === undefined) return false;
    return effectiveLpOwnerId(lp) === Number(scopeSatkerId);
}

/** SQL predicate dengan parameter yang sudah dibuat caller, contoh: effectiveLpScopeSql('lp', '$1'). */
export function effectiveLpScopeSql(alias: string, parameter: string): string {
    return `coalesce(${alias}.unit_satker_id, ${alias}.satker_id) = ${parameter}`;
}
