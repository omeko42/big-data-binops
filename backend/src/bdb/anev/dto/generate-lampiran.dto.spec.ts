/**
 * BDB-001 (CWE-89) -- validasi DTO body endpoint lampiran/generate.
 *
 * Acceptance criteria: kelompokHitung, modelLp, closureReason harus lolos
 * @Matches(/^[A-Z0-9_]+$/) dan DITOLAK 400 bila tidak cocok; golonganId dan
 * satkerId divalidasi sebagai integer positif.
 */
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { GenerateLampiranDto } from './generate-lampiran.dto';

const validateBody = async (body: any) => {
    const dto = plainToClass(GenerateLampiranDto, body);
    return validate(dto, { whitelist: true });
};

describe('BDB-001 GenerateLampiranDto -- validasi input', () => {
    it('body valid lolos (kelompokHitung, golonganId, modelLp, closureReason, satkerId)', async () => {
        const errors = await validateBody({
            kelompokHitung: 'TIPIDUM',
            golonganId: 4,
            modelLp: 'A',
            closureReason: 'RJ',
            satkerId: 42
        });
        expect(errors).toHaveLength(0);
    });

    it('kelompokHitung dengan single quote DITOLAK', async () => {
        const errors = await validateBody({ kelompokHitung: "TIPIDUM'" });
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('kelompokHitung');
    });

    it('kelompokHitung dengan OR 1=1 DITOLAK', async () => {
        const errors = await validateBody({ kelompokHitung: "TIPIDUM')OR('1'='1" });
        expect(errors.length).toBeGreaterThan(0);
    });

    it('kelompokHitung daftar (pisah koma) tetap DITERIMA', async () => {
        const errors = await validateBody({ kelompokHitung: 'TIPIDUM,TIPIDSIBER' });
        expect(errors).toHaveLength(0);
    });

    it('modelLp dengan payload DITOLAK', async () => {
        const errors = await validateBody({ modelLp: "Z'/**/OR/**/'1'='1" });
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('modelLp');
    });

    it('closureReason dengan payload DITOLAK', async () => {
        const errors = await validateBody({ closureReason: "Z'/**/OR/**/'1'='1" });
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('closureReason');
    });

    it('golonganId non-integer DITOLAK', async () => {
        const errors = await validateBody({ golonganId: "1') OR ('1'='1" });
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('golonganId');
    });

    it('golonganId negatif / nol DITOLAK', async () => {
        expect((await validateBody({ golonganId: -1 })).length).toBeGreaterThan(0);
        expect((await validateBody({ golonganId: 0 })).length).toBeGreaterThan(0);
    });

    it('satkerId non-integer DITOLAK', async () => {
        const errors = await validateBody({ satkerId: '1; DROP TABLE bdb_laporan_polisi' });
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('satkerId');
    });

    it('satkerId negatif / nol DITOLAK', async () => {
        expect((await validateBody({ satkerId: -5 })).length).toBeGreaterThan(0);
        expect((await validateBody({ satkerId: 0 })).length).toBeGreaterThan(0);
    });
});
