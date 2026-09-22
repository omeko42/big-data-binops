import { effectiveLpOwnerId, effectiveLpScopeSql, hasEffectiveLpAccess } from './lp-scope.util';

describe('LP effective owner scope', () => {
    const lpUnit = { satker_id: 500, unit_satker_id: 501 };

    it('gives ownership to the mapped unit, not its territorial parent', () => {
        expect(effectiveLpOwnerId(lpUnit)).toBe(501);
        expect(hasEffectiveLpAccess(lpUnit, 501)).toBe(true);
        expect(hasEffectiveLpAccess(lpUnit, 500)).toBe(false);
    });

    it('falls back to satker_id for territorial or legacy rows without a unit', () => {
        expect(effectiveLpOwnerId({ satker_id: '500', unit_satker_id: null })).toBe(500);
        expect(hasEffectiveLpAccess({ satker_id: 500, unit_satker_id: null }, 500)).toBe(true);
    });

    it('does not grant access when the LP or scope has no valid owner', () => {
        expect(effectiveLpOwnerId({ satker_id: null, unit_satker_id: null })).toBeNull();
        expect(hasEffectiveLpAccess(lpUnit, null)).toBe(false);
        expect(hasEffectiveLpAccess(null, 501)).toBe(false);
    });

    it('builds the same unit-first rule for SQL queries', () => {
        expect(effectiveLpScopeSql('lp', '$3')).toBe('coalesce(lp.unit_satker_id, lp.satker_id) = $3');
    });
});
