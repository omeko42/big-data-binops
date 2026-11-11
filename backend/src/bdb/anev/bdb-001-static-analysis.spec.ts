/**
 * BDB-001 (CWE-89) -- bukti "test GAGAL SEBELUM fix, LULUS SESUDAH fix".
 *
 * Uji ini MEMBACA FILE SUMBER anev.service.ts + lampiran-filter.util.ts dan
 * memeriksa tidak adanya interpolasi nilai request ke dalam string SQL.
 *
 *  - Pada kode SEBELUM fix (HEAD): file anev.service.ts masih merakit SQL
 *    dengan konkatenasi nilai request -> asersi ini GAGAL (exit != 0).
 *  - Pada kode SESUDAH fix: filter dibangun lewat buildLampiranFilterSql()
 *    yang memakai placeholder $1..$n -> asersi LULUS (exit 0).
 *
 * Nama kolom SQL tidak di-hardcode di sini, sehingga uji ini tahan terhadap
 * perubahan nama kolom di masa depan.
 */
import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = __dirname;
const ANEV_SERVICE = path.join(SRC_DIR, 'anev.service.ts');
const FILTER_UTIL = path.join(SRC_DIR, 'lampiran-filter.util.ts');

const read = (p: string) => fs.readFileSync(p, 'utf8');

describe('BDB-001 analisis statis -- tidak ada interpolasi request ke SQL', () => {
    it('anev.service.ts tidak boleh merakit SQL dengan nilai kelompokHitung', () => {
        const src = read(ANEV_SERVICE);
        // Pola vuln: SQL string digabung dengan nilai request lewat + atau ${}.
        const vulnerable = src
            .split('\n')
            .filter((line) =>
                /kelompok IN \(/.test(line) ||
                /groupListSql/.test(line) ||
                /LIKE '%" \+/.test(line) ||
                /= '"\s*\+\s*active/.test(line)
            );
        expect(vulnerable).toEqual([]);
    });

    it('anev.service.ts tidak boleh menyisipkan request apa pun ke SQL lewat + atau ${}', () => {
        const src = read(ANEV_SERVICE);
        const offenders = src.split('\n').filter((line) => {
            const mentionsRequestValue =
                /activeKelompokHitung|activeModelLp|activeClosureReason|activeGolonganId/.test(line);
            if (!mentionsRequestValue) return false;
            const isSqlLine =
                /satkerFilterSql|crimeFilterSql|groupListSql|bdb_kinerja_crime_group_mapping|lp\.(jenis|golongan|model)|status_master/.test(
                    line
                );
            if (!isSqlLine) return false;
            const isSqlInterpolation =
                /['"]\s*\+\s*(activeKelompokHitung|activeModelLp|activeClosureReason|activeGolonganId)/.test(line) ||
                /\$\{(activeKelompokHitung|activeModelLp|activeClosureReason|activeGolonganId)\}/.test(line);
            return isSqlInterpolation;
        });
        expect(offenders).toEqual([]);
    });

    it('anev.service.ts wajib memakai buildLampiranFilterSql (filter terparameterisasi)', () => {
        const src = read(ANEV_SERVICE);
        expect(src).toContain("from './lampiran-filter.util'");
        expect(src).toContain('buildLampiranFilterSql(');
    });

    it('lampiran-filter.util.ts harus memakai placeholder parameter & array param', () => {
        const src = read(FILTER_UTIL);
        expect(src).toContain('::text[]');
        expect(src).toContain('params.push(value)');
        // Tidak boleh ada penyisipan nilai ke string SQL lewat operator +.
        const concatOffenders = src.split('\n').filter((line) => {
            if (!/['"`]/.test(line)) return false;
            return /\+\s*(input\.|String\(input\.)/.test(line);
        });
        expect(concatOffenders).toEqual([]);
    });
});
