/**
 * BDB-003 (CWE-639 / CWE-200) -- scope satker & masking NIK untuk recent-global.
 *
 * Test ini menjalankan klausa scope yang DIHASILKAN kode (buildScopeSql) terhadap
 * PostgreSQL nyata (PGlite) dengan data beberapa satker, lalu membuktikan:
 *   - user satker A hanya melihat baris satker A (+ subtree-nya)
 *   - user satker B tidak melihat baris satker A
 *   - role nasional (scope.all) melihat semuanya
 *   - user tanpa satker tidak melihat apa pun
 *   - NIK dimask untuk role non-nasional
 */
import { applyNikMasking, buildScopeSql, maskNik } from './recent-global-scope.util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PGlite } = require('@electric-sql/pglite');

const SCHEMA = `
create table bdb_satker (
  id int primary key,
  parent_id int,
  kode text
);
create table bdb_laporan_polisi (
  id serial primary key,
  deleted_at timestamptz,
  satker_id int,
  unit_satker_id int,
  no_laporan text
);
create table bdb_dpo (
  id serial primary key,
  satker_id int,
  status_dpo text,
  nama_dpo text,
  nomor_identitas text
);
`;

describe('BDB-003 scope satker recent-global', () => {
    let db: any;

    beforeAll(async () => {
        db = new PGlite();
        await db.exec(SCHEMA);
        await db.exec(`
          insert into bdb_satker (id, parent_id, kode) values
            (1, null, '00'),
            (10, 1, '060.01'),
            (11, 10, '060.01.17'),
            (12, 10, '060.01.18'),
            (20, 1, '060.02'),
            (21, 20, '060.02.05');

          insert into bdb_laporan_polisi (satker_id, unit_satker_id, no_laporan) values
            (10, 11, 'LP-A1'),
            (10, 12, 'LP-A2'),
            (20, 21, 'LP-B1'),
            (20, 21, 'LP-B2'),
            (20, 21, 'LP-B3');

          insert into bdb_dpo (satker_id, status_dpo, nama_dpo, nomor_identitas) values
            (11, 'AKTIF', 'DPO A', '3201234567890001'),
            (21, 'AKTIF', 'DPO B', '3201234567890002');
        `);
    });

    afterAll(async () => {
        if (db) await db.close();
    });

    const runLp = async (scope: any) => {
        const params: any[] = [];
        const scopeSql = buildScopeSql(scope, 'lp', params);
        const rows = await db.query(
            `select lp.no_laporan from bdb_laporan_polisi lp
             where lp.deleted_at is null and ${scopeSql}
             order by lp.no_laporan`,
            params
        );
        return rows.rows.map((r: any) => r.no_laporan);
    };

    const runDpo = async (scope: any) => {
        const params: any[] = [];
        const scopeSql = buildScopeSql(scope, 'dpo', params);
        const rows = await db.query(
            `select d.nama_dpo from bdb_dpo d
             where d.status_dpo = 'AKTIF' and ${scopeSql}
             order by d.nama_dpo`,
            params
        );
        return rows.rows.map((r: any) => r.nama_dpo);
    };

    it('scope.all (role nasional) -> melihat semua satker', async () => {
        expect(await runLp({ all: true, satkerId: null })).toEqual(['LP-A1', 'LP-A2', 'LP-B1', 'LP-B2', 'LP-B3']);
    });

    it('scope satker 10 -> hanya LP satker subtree 10 (A1,A2), B TIDAK boleh ikut', async () => {
        const got = await runLp({ all: false, satkerId: 10 });
        expect(got).toEqual(['LP-A1', 'LP-A2']);
        expect(got).not.toContain('LP-B1');
        expect(got).not.toContain('LP-B2');
        expect(got).not.toContain('LP-B3');
    });

    it('scope satker 20 -> hanya LP satker subtree 20 (B1,B2,B3), A TIDAK boleh ikut', async () => {
        const got = await runLp({ all: false, satkerId: 20 });
        expect(got).toEqual(['LP-B1', 'LP-B2', 'LP-B3']);
        expect(got).not.toContain('LP-A1');
        expect(got).not.toContain('LP-A2');
    });

    it('user tanpa satker (satkerId null) -> tidak melihat data apa pun', async () => {
        expect(await runLp({ all: false, satkerId: null })).toEqual([]);
    });

    it('scope DPO: satker 10 hanya melihat DPO satkernya', async () => {
        const got = await runDpo({ all: false, satkerId: 10 });
        expect(got).toEqual(['DPO A']);
        expect(got).not.toContain('DPO B');
    });

    it('scope DPO: role nasional melihat semua DPO', async () => {
        expect(await runDpo({ all: true, satkerId: null })).toEqual(['DPO A', 'DPO B']);
    });

    it('IDOR: scope satker 20 tidak boleh membocorkan LP satker 10', async () => {
        const leaked = (await runLp({ all: false, satkerId: 20 })).filter((x: string) => x.startsWith('LP-A'));
        expect(leaked).toEqual([]);
    });
});

describe('BDB-003 masking NIK', () => {
    it('NIK 16 digit -> 6 awal + disamarkan + 4 akhir', () => {
        expect(maskNik('3201234567890001')).toBe('320123******0001');
    });

    it('NIK pendek <= 10 digit -> disamarkan penuh', () => {
        expect(maskNik('12345')).toBe('*****');
        expect(maskNik('1234567890')).toBe('**********');
    });

    it('nik null / undefined / kosong -> tidak berubah', () => {
        expect(maskNik(null)).toBeNull();
        expect(maskNik(undefined)).toBeUndefined();
        expect(maskNik('')).toBe('');
    });

    it('applyNikMasking: NIK dan nomor_identitas dimask, kolom lain utuh', () => {
        const rows = [
            { nama: 'A', nik: '3201234567890001', nomor_identitas: '3201234567890002', sumber: 'DORS' },
            { nama: 'B', nik: null, nomor_identitas: null, sumber: 'DPO' }
        ];
        const out = applyNikMasking(rows, true);
        expect(out[0].nik).toBe('320123******0001');
        expect(out[0].nomor_identitas).toBe('320123******0002');
        expect(out[0].nama).toBe('A');
        expect(out[1].nik).toBeNull();
    });

    it('applyNikMasking dengan mask=false -> NIK tetap penuh (role nasional)', () => {
        const rows = [{ nik: '3201234567890001' }];
        expect(applyNikMasking(rows, false)[0].nik).toBe('3201234567890001');
    });
});
