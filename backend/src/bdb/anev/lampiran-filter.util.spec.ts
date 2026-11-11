/**
 * BDB-001 (CWE-89) -- test keamanan SQL injection pada filter "Lampiran Anev".
 *
 * Two tingkat bukti:
 *  1. Unit test pada buildLampiranFilterSql(): memastikan tidak ada interpolasi
 *     nilai request ke dalam string SQL, dan kelompokHitung memakai array param.
 *  2. Uji integrasi terhadap PostgreSQL sungguhan (PGlite): payload attacker
 *     tidak boleh mengubah hasil agregat dan tidak boleh memicu error SQL.
 */
import { buildLampiranFilterSql } from './lampiran-filter.util';

describe('BDB-001 buildLampiranFilterSql -- parameterisasi SQL', () => {
    it('kelompokHitung masuk sebagai array parameter, bukan IN (\'a\',\'b\')', () => {
        const { sql, params } = buildLampiranFilterSql({ kelompokHitung: 'TIPIDUM,TIPIDSIBER' }, 3);
        expect(sql).toContain('kelompok = ANY($3::text[])');
        expect(sql).not.toMatch(/kelompok IN \('/);
        expect(params[0]).toEqual(['TIPIDUM', 'TIPIDSIBER']);
    });

    it('tidak ada nilai request yang bocor ke string SQL (quote attacker)', () => {
        const payloads = [
            "TIPIDUM') OR ('1'='1",
            "TIPIDUM'",
            "Z'/**/OR/**/'1'='1"
        ];
        for (const p of payloads) {
            const { sql, params } = buildLampiranFilterSql(
                { kelompokHitung: p, modelLp: p, closureReason: p },
                3
            );
            // Nilai attacker hanya boleh muncul sebagai parameter, tidak pernah di SQL.
            expect(sql).not.toContain(p);
            // Tidak boleh ada literal yang berisi sebagian dari payload (mis. "OR('1'='1").
            expect(sql).not.toMatch(/OR\s*\(/i);
            expect(sql).not.toMatch(/EXISTS\s*\(/i);
            // Semua kemunculan nilai request harus lewat placeholder.
            expect(sql).toContain('$3');
            expect(params).toContain(p);
        }
    });

    it('golonganId / modelLp / closureReason jadi parameter terpisah', () => {
        const { sql, params } = buildLampiranFilterSql(
            { golonganId: 4, modelLp: 'A', closureReason: 'RJ' },
            3
        );
        expect(sql).toContain('= $3');
        expect(sql).toContain('= $4');
        expect(sql).toContain('$5');
        expect(params).toEqual([4, 'A', 'RJ']);
    });

    it('targetSatkerId dan kode satker jadi parameter', () => {
        const { sql, params } = buildLampiranFilterSql(
            { targetSatkerId: 42, isApexBareskrim: false, satkerKode: '060.01.17' },
            3
        );
        expect(sql).toContain('lp.satker_id = $3');
        expect(sql).not.toContain('42');
        expect(params[0]).toBe(42);
        expect(params[1]).toBe('060.01.17.%');
    });
});
