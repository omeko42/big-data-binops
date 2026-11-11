/**
 * BDB-003 (CWE-639) -- recent-global WAJIB menerapkan scope satker.
 *
 * Test ini menguji SERVICE yang sebenarnya (bukan util terpisah) dengan
 * DataSource tiruan yang MENANGKAP SQL + params yang dikirim ke database.
 *
 * Yang dibuktikan:
 *   - Setiap query recentGlobal memuat klausa scope satker (recursive subtree).
 *   - Root satker dikirim sebagai PARAMETER PostgreSQL, bukan interpolasi string.
 *   - NIK dimask untuk role non-nasional.
 *
 * Pada kode pre-fix, klausa scope TIDAK ADA sama sekali -> test gagal.
 */
import { PihakTerlibatService } from './pihak-terlibat.service';

type Captured = { sql: string; params: any[] };

function makeService(opts: { scope?: any; roleBdb?: string } = {}) {
    const captured: Captured[] = [];

    const scope = opts.scope || { all: false, satkerId: 10 };
    const roleBdb = opts.roleBdb || 'operator';

    // DataSource tiruan: query() merekam SQL+params lalu mengembalikan baris kosong.
    const dataSource: any = {
        query: async (sql: string, params: any[] = []) => {
            captured.push({ sql: String(sql), params: Array.isArray(params) ? params : [] });
            // resolveScope() juga lewat ds.query -> jawab dengan baris user.
            if (/from auth_users u/i.test(sql)) {
                return [
                    {
                        role_bdb: roleBdb,
                        role_name: roleBdb,
                        scope_satker_id: scope.satkerId,
                        satker_deskripsi: 'POLRES X',
                        satker_tipe: 'POLRES'
                    }
                ];
            }
            return [];
        },
        createQueryRunner: () => ({
            connect: async () => {},
            startTransaction: async () => {},
            commitTransaction: async () => {},
            rollbackTransaction: async () => {},
            release: async () => {},
            query: async () => []
        })
    };

    const service = new PihakTerlibatServiceShim(dataSource);
    return { service, captured };
}

/**
 * Shim: PihakTerlibatService punya dependency berat (AuditService, MinioService,
 * LpMonitoringAccessService). Untuk menguji recentGlobal kita hanya butuh dataSource,
 * jadi instantiate kelas tanpa menjalankan constructor aslinya.
 */
class PihakTerlibatServiceShim extends PihakTerlibatService {
    constructor(dataSource: any) {
        super(dataSource, null as any, null as any, null as any);
    }
}

describe('BDB-003 recentGlobal menerapkan scope satker', () => {
    it('query recentGlobal memuat klausa scope subtree satker', async () => {
        const { service, captured } = makeService({ scope: { all: false, satkerId: 10 }, roleBdb: 'operator' });

        await (service as any).recentGlobal({ id: 1, role_bdb: 'operator' }, 1, 20);

        // Query data: hanya query data (bukan query resolusi scope auth_users).
        const dataCalls = captured.filter((c) => !/from auth_users u/i.test(c.sql));
        expect(dataCalls.length).toBeGreaterThan(0);
        for (const c of dataCalls) {
            expect(c.sql).toMatch(/scope_tree/i);
        }
    });

    it('root satker dikirim sebagai parameter ($n), bukan interpolasi string', async () => {
        const { service, captured } = makeService({ scope: { all: false, satkerId: 10 }, roleBdb: 'operator' });

        await (service as any).recentGlobal({ id: 1, role_bdb: 'operator' }, 1, 20);

        // Scope query harus punya placeholder dan menyertakan 10 di params.
        const scopeCalls = captured.filter((c) => /scope_tree/i.test(c.sql));
        expect(scopeCalls.length).toBeGreaterThan(0);
        for (const c of scopeCalls) {
            expect(c.sql).toMatch(/\$\d+/);
            expect(c.params).toContain(10);
            // Tidak boleh ada interpolasi literal angka mentah di SQL.
            expect(c.sql).not.toMatch(/where id\s*=\s*10\b/i);
        }
    });

    it('role nasional (scope.all) -> query tetap jalan tanpa param scope', async () => {
        const { service, captured } = makeService({ scope: { all: true, satkerId: null }, roleBdb: 'superadmin' });

        await (service as any).recentGlobal({ id: 1, role_bdb: 'superadmin' }, 1, 20);

        for (const c of captured) {
            if (/scope_tree/i.test(c.sql)) {
                expect(c.params).not.toContain(10);
            }
        }
    });

    it('NIK dimask untuk role non-nasional', async () => {
        const { service, captured } = makeService({ scope: { all: false, satkerId: 10 }, roleBdb: 'operator' });

        // DataSource tiruan mengembalikan satu baris dengan NIK penuh.
        const ds = (service as any).dataSource;
        ds.query = async (sql: string, params: any[] = []) => {
            captured.push({ sql: String(sql), params: Array.isArray(params) ? params : [] });
            if (/from auth_users u/i.test(sql)) {
                return [{ role_bdb: 'operator', role_name: 'operator', scope_satker_id: 10 }];
            }
            return [
                {
                    sumber: 'DORS',
                    nama: 'Seseorang',
                    nik: '3201234567890001',
                    nomor_identitas: '3201234567890002',
                    created_at: new Date('2026-01-01')
                }
            ];
        };

        const res: any = await (service as any).recentGlobal({ id: 1, role_bdb: 'operator' }, 1, 20);

        const row = res.data[0];
        expect(row.nik).toBe('320123******0001');
        expect(row.nomor_identitas).toBe('320123******0002');
    });

    it('role nasional -> NIK TIDAK dimask', async () => {
        const { service, captured } = makeService({ scope: { all: true, satkerId: null }, roleBdb: 'superadmin' });

        const ds = (service as any).dataSource;
        ds.query = async (sql: string, params: any[] = []) => {
            captured.push({ sql: String(sql), params: Array.isArray(params) ? params : [] });
            if (/from auth_users u/i.test(sql)) {
                return [{ role_bdb: 'superadmin', role_name: 'superadmin', scope_satker_id: null }];
            }
            return [
                {
                    sumber: 'DORS',
                    nama: 'Seseorang',
                    nik: '3201234567890001',
                    nomor_identitas: '3201234567890002',
                    created_at: new Date('2026-01-01')
                }
            ];
        };

        const res: any = await (service as any).recentGlobal({ id: 1, role_bdb: 'superadmin' }, 1, 20);

        expect(res.data[0].nik).toBe('3201234567890001');
    });
});
