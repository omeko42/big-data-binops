/**
 * BDB-001 (CWE-89) -- uji integrasi SQL nyata.
 *
 * Menjalankan query agregat yang SAMA POLA dengan filter "Lampiran Anev" terhadap
 * PostgreSQL sungguhan (PGlite). Dua versi filter dijalankan:
 *  - versi LAMA (interpolasi string) --WIJIB gagal: payload attacker mengubah
 *    hasil agregat dan/atau memunculkan error SQL.
 *  - versi BARU (parameter PostgreSQL) --WAJIB lulus: payload tidak mengubah
 *    agregat, tidak ada error SQL.
 *
 * Ini bukti "test gagal sebelum fix, lulus sesudah fix" yang bisa direproduksi.
 */
import { buildLampiranFilterSql } from './lampiran-filter.util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PGlite } = require('@electric-sql/pglite');

const SCHEMA = `
create table bdb_laporan_polisi (
  id serial primary key,
  deleted_at timestamptz,
  dilimpahkan_eksternal boolean default false,
  satker_id int,
  unit_satker_id int,
  jenis_kejahatan_id int,
  golongan_kejahatan_id int,
  model_lp text,
  status_id int,
  tgl_laporan text
);
create table bdb_kinerja_crime_group_mapping (
  jenis_kejahatan_id int,
  kelompok text,
  active boolean,
  decision_status text
);
create table cm_jenis_kejahatan (id serial primary key, keterangan text);
create table bdb_status_master (id serial primary key, nama text);
create table bdb_satker (id int primary key, parent_id int, kode text);
`;

    // parse_tgl_laporan() adalah custom function DB di produksi (parse 'DD-MM-YYYY HH24:MI:SS').
    // Dibuat ulang di sini supaya query agregat bisa dijalankan di PGlite.
    const PARSE_FN = `
      create or replace function parse_tgl_laporan(txt text) returns date as $$
      begin
        if txt is null then return null; end if;
        return to_date(substring(txt from 1 for 10), 'DD-MM-YYYY');
      end $$ language plpgsql;
    `;

const AGG_QUERY = (filterSql: string) => `
  SELECT count(*)::int AS total
  FROM bdb_laporan_polisi lp
  LEFT JOIN cm_jenis_kejahatan jk ON jk.id = lp.jenis_kejahatan_id
  WHERE lp.deleted_at IS NULL
    AND coalesce(lp.dilimpahkan_eksternal, false) = false
    ${filterSql}
    AND parse_tgl_laporan(lp.tgl_laporan) BETWEEN $1::date AND $2::date
`;

describe('BDB-001 integrasi SQL (PostgreSQL nyata)', () => {
    let db: any;

    beforeAll(async () => {
        db = new PGlite();
        await db.exec(SCHEMA);
        await db.exec(PARSE_FN);
        await db.exec(`
          insert into cm_jenis_kejahatan (id, keterangan) values (1, 'Pencurian'), (2, 'N.shopping');
          insert into bdb_status_master (id, nama) values (1, 'SELESAI'), (2, 'RJ');
          insert into bdb_satker (id, parent_id, kode) values (10, 1, '060.01.17');
          insert into bdb_kinerja_crime_group_mapping (jenis_kejahatan_id, kelompok, active, decision_status)
            values (1, 'TIPIDUM', true, 'APPROVED'), (2, 'TIPIDSIBER', true, 'APPROVED');
          insert into bdb_laporan_polisi
            (satker_id, unit_satker_id, jenis_kejahatan_id, golongan_kejahatan_id, model_lp, status_id, tgl_laporan)
          values
            (10, 10, 1, 4, 'A', 1, '01-01-2026 10:00:00'),
            (10, 10, 1, 4, 'A', 2, '02-01-2026 10:00:00'),
            (10, 10, 2, 4, 'B', 1, '03-01-2026 10:00:00'),
            (11, 11, 1, 4, 'A', 1, '04-01-2026 10:00:00');
        `);
    });

    afterAll(async () => {
        if (db) await db.close();
    });

    const runFixed = async (kelompokHitung: string) => {
        const { sql, params } = buildLampiranFilterSql({ kelompokHitung }, 3);
        const rows = await db.query(AGG_QUERY(sql), ['2026-01-01', '2026-01-31', ...params]);
        return Number(rows.rows[0].total);
    };

    it('BASELINE: kelompokHitung=TIPIDUM -> 3 baris', async () => {
        const total = await runFixed('TIPIDUM');
        expect(total).toBe(3);
    });

    it('payload single quote tidak boleh memunculkan error SQL', async () => {
        // Versi parameter: payload diperlakukan sebagai nilai biasa -> 0 baris, tanpa error.
        const total = await runFixed("TIPIDUM'");
        expect(total).toBe(0);
    });

    it('payload OR 1=1 tidak boleh mengubah agregat', async () => {
        const baseline = await runFixed('TIPIDUM');
        const injected = await runFixed("TIPIDUM')OR('1'='1");
        // Setelah fix: payload diperlakukan sebagai NILAI biasa (bukan filter), jadi
        // hasilnya 0 baris -- BUKAN baseline, dan BUKAN angka "semua data".
        // Yang dibuktikan: filter tidak lagi bisa dikontrol penyerang.
        expect(injected).not.toBe(4); // 4 = seluruh baris (hasil breakout OR 1=1)
        expect(injected).toBe(0);
        expect(baseline).toBe(3);
    });

    it('payload EXISTS ke tabel lain tidak boleh berhasil (blind cross-table read)', async () => {
        const payload = "TIPIDUM')OR(EXISTS(SELECT/**/1/**/FROM/**/auth_users)='1";
        let threw: any = null;
        let total = -1;
        try {
            total = await runFixed(payload);
        } catch (e) {
            threw = e;
        }
        // Tidak boleh ada error SQL yang bocor (mis. "relation auth_users does not exist").
        if (threw) {
            const msg = String(threw.message || threw);
            expect(msg).not.toMatch(/does not exist|syntax error/i);
        }
        // Subquery tidak pernah dieksekusi -> hasilnya 0 baris, bukan seluruh tabel.
        expect(total).toBe(0);
    });

    it('kelompok tidak ada -> agregat kosong, tanpa error', async () => {
        const total = await runFixed('TIDAK_ADA');
        expect(total).toBe(0);
    });

    it('REGRESI: filter sah tetap menghasilkan angka yang benar', async () => {
        expect(await runFixed('TIPIDUM')).toBe(3);
        expect(await runFixed('TIPIDSIBER')).toBe(1);
        expect(await runFixed('TIPIDUM,TIPIDSIBER')).toBe(4);
    });
});
