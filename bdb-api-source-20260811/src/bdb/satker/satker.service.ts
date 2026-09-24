import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LaporanPolisiService } from '../laporan-polisi/laporan-polisi.service';
import { KinerjaPerkaraService } from '../kinerja-perkara/kinerja-perkara.service';
import { isPrimaryClusterInstance } from '../common/cluster-instance.util';

/**
 * Master Satker Puskarda. Data awal ditarik sekali dari Robinops (sudah dilakukan),
 * selanjutnya DIKELOLA MANUAL (tambah/ubah/hapus). Hierarki treeview dibangun dari
 * KodeSatkerPuskarda (prefix per-segmen; "00" = placeholder). Root: node sintetis "060" = POLRI.
 */
@Injectable()
export class SatkerService implements OnModuleInit {
    private readonly logger = new Logger('SatkerService');
    constructor(
        private readonly dataSource: DataSource,
        private readonly laporanPolisiService: LaporanPolisiService,
        private readonly kinerjaPerkaraService: KinerjaPerkaraService
    ) {}

    /** Rebuild hierarki otomatis tiap boot -- jaga2 kalau ada migrasi data (mis. sql/bdb/063) yg
     *  insert node baru dgn parent_id/root_id/depth kosong (sengaja, krn kode_canonical sudah
     *  cukup jadi sumber kebenaran, rebuildHierarchy() yg isi sisanya). Tanpa ini, node dari migrasi
     *  akan "nyangkut" tak tersusun sampai ada yg iseng tambah/ubah satker manual (yg baru trigger
     *  rebuild). Ringan & idempotent, aman jalan tiap start -- TAPI cuma di 1 proses (lihat
     *  isPrimaryClusterInstance(): insiden 5 Agu 2026, 32 proses PM2 cluster jalankan ini
     *  bersamaan saat boot bikin deadlock beruntun di Postgres). */
    async onModuleInit() {
        if (!isPrimaryClusterInstance()) return;
        try {
            await this.rebuildHierarchy();
        } catch (e: any) {
            this.logger.warn('gagal rebuild hierarki satker saat boot: ' + (e?.message || e));
        }
    }

    private tableEnsured = false;
    async ensureTable() {
        return;
    }

    // kolom alamat/lokasi yang bisa dikelola manual (operator/admin_binops self-service jg boleh)
    private static readonly EXTRA_COLS = ['alamat', 'provinsi', 'kabupaten_kota', 'kecamatan', 'desa', 'kode_pos', 'longitude', 'latitude', 'jumlah_penduduk'];
    // klasifikasi -- superadmin-only (lihat create()/update()), TIDAK termasuk EXTRA_COLS spy tak ikut
    // ke jalur self-service updateMyProfile().
    private static readonly KEANGGOTAAN_OPTS = ['INTERNAL_POLRI', 'EKSTERNAL_POLRI'];
    private static readonly FUNGSI_OPTS = ['INTERNAL_RESERSE', 'EKSTERNAL_RESERSE'];
    // wilayah (POLDA/POLRES/POLSEK) vs satuan organisasi (FUNGSI) -- auto-terdeteksi dari nama saat
    // dibuat (lihat trigger di ensureTable()), tapi superadmin bisa koreksi manual di sini kalau
    // penamaannya tak lazim/tak lolos deteksi otomatis.
    private static readonly TIPE_SATKER_OPTS = ['POLDA', 'POLRES', 'POLSEK', 'FUNGSI'];

    // ---- hierarki helpers ----
    private canon(code: string): string[] {
        const s = String(code).split('.');
        while (s.length > 1 && s[s.length - 1] === '00') s.pop();
        return s;
    }
    private parentKey(segs: string[]): string | null {
        const s = segs.slice(0, -1);
        while (s.length > 1 && s[s.length - 1] === '00') s.pop();
        return s.length ? s.join('.') : null;
    }

    /** Pastikan node root sintetis POLRI (060) ada; kembalikan id-nya. */
    private async ensureRoot(): Promise<number> {
        const r = await this.dataSource.query('select id from bdb_satker where is_root=true limit 1');
        if (r.length) return r[0].id;
        const ins = await this.dataSource.query(
            `insert into bdb_satker (kode, kode_canonical, deskripsi, depth, is_root, is_synthetic, source, synced_at)
             values ('060','060','POLRI (MABES POLRI)',0,true,true,'SYNTHETIC',now()) returning id`
        );
        return ins[0].id;
    }

    /**
     * Hitung ulang parent_id/root_id/depth SEMUA node dari kode_canonical masing-masing.
     * Dipanggil setelah tiap perubahan (tambah/ubah/hapus) agar pohon selalu konsisten.
     */
    async rebuildHierarchy() {
        await this.ensureTable();
        const rootId = await this.ensureRoot();
        const all = await this.dataSource.query('select id, kode_canonical from bdb_satker where is_synthetic=false');
        const canonSet = new Set<string>(all.map((r: any) => r.kode_canonical));
        const idByCanon = new Map<string, number>(all.map((r: any) => [r.kode_canonical, r.id]));

        const parentOf = new Map<string, string | null>();
        // Canonical code is a stable historical identity. These audited overrides model the
        // current operational parent without rewriting IDs/codes referenced by LP and users.
        const hierarchyParentOverrides = new Map<string, string>([
            // Kubu Raya: retain historic identifiers while using the current territorial parent.
            ['060.01.18.02.08', '060.01.18.14'],
            ['060.01.18.02.09', '060.01.18.14'],
            ['060.01.18.02.10', '060.01.18.14'],
            ['060.01.18.02.11', '060.01.18.14'],
            // Current regional parents; retain historical DORS/Pusiknas identifiers.
            ['060.01.13.15.16', '060.01.13.23'],
            ['060.01.13.15.14', '060.01.13.23'], // POLSEK -> POLRES PANGANDARAN
            ['060.01.13.15.15', '060.01.13.23'], // POLSEK -> POLRES PANGANDARAN
            ['060.01.13.15.17', '060.01.13.23'], // POLSEK -> POLRES PANGANDARAN
            ['060.01.13.15.18', '060.01.13.23'], // POLSEK -> POLRES PANGANDARAN
            ['060.01.13.15.19', '060.01.13.23'], // POLSEK -> POLRES PANGANDARAN
            ['060.01.13.15.23', '060.01.13.23'], // POLSEK -> POLRES PANGANDARAN
            ['060.01.13.15.24', '060.01.13.23'], // POLSEK -> POLRES PANGANDARAN
            ['060.01.13.15.25', '060.01.13.23'], // POLSEK -> POLRES PANGANDARAN
            ['060.01.25.18.01', '060.01.25.25'],
            ['060.01.25.18.05', '060.01.25.25'],
            ['060.01.25.18.08', '060.01.25.25'],
            ['060.01.25.18.07', '060.01.25.25'], // POLSEK RINDINGALLO -> POLRES TORAJA UTARA
            ['060.01.25.18.09', '060.01.25.25'], // POLSEK TONDON NANGGALA -> POLRES TORAJA UTARA
            ['060.01.25.18.10', '060.01.25.25'], // POLSEK SA'DAN BALUSU -> POLRES TORAJA UTARA
            ['060.01.25.18.12', '060.01.25.25'], // POLSEK PERSIAPAN SOPAI -> POLRES TORAJA UTARA
            // POLSEK current jajaran POLRES SUBULUSSALAM; canonical lineage historis masih
            // berada di POLRES ACEH SINGKIL.
            ['060.01.02.16.02', '060.01.02.23'], // POLSEK SIMPANG KIRI
            ['060.01.02.16.05', '060.01.02.23'], // POLSEK RUNDENG
            ['060.01.02.16.06', '060.01.02.23'], // POLSEK PENANGGALAN
            ['060.01.02.16.10', '060.01.02.23'], // POLSEK SULTAN DAULAT
            ['060.01.02.16.15', '060.01.02.23'], // POLSEK LONGKIB

            ['060.01.32.26', '060.01.37'],
            ['060.01.32.15', '060.01.37'],
            ['060.01.32.17', '060.01.37'],
            ['060.01.33.09', '060.01.36'],
            ['060.01.03.13.01', '060.01.03.101'],
            ['060.01.27.09.01', '060.01.27.13'],
            ['060.01.27.09.06', '060.01.27.13'],

            // POLRES MALUKU TENGGARA.
            ['060.01.30.03.00.10', '060.01.30.35'],
            ['060.01.30.03.00.13', '060.01.30.35'],
            ['060.01.30.03.00.14', '060.01.30.35'],
            ['060.01.30.03.00.16', '060.01.30.35'],
            ['060.01.30.03.00.17', '060.01.30.35'],
            ['060.01.30.03.01', '060.01.30.35'],
            ['060.01.30.03.02', '060.01.30.35'],
            ['060.01.30.03.03', '060.01.30.35'],
            ['060.01.30.03.04', '060.01.30.35'],
            ['060.01.30.03.07', '060.01.30.35'],
            ['060.01.30.03.09', '060.01.30.35'],
            ['060.01.31.07.04', '060.01.31.05'],

            // POLRES KEPULAUAN TANIMBAR.
            ['060.01.30.04.01', '060.01.30.12'],
            ['060.01.30.04.02', '060.01.30.12'],
            ['060.01.30.04.03', '060.01.30.12'],
            ['060.01.30.04.04', '060.01.30.12'],
            ['060.01.30.04.05', '060.01.30.12'],
            ['060.01.30.04.06', '060.01.30.12'],
            ['060.01.30.04.07', '060.01.30.12'],
            ['060.01.30.04.08', '060.01.30.12'],
            ['060.01.30.04.09', '060.01.30.12'],

            // POLRES PASANGKAYU.
            ['060.01.34.05.01', '060.01.34.06'],
            ['060.01.34.05.02', '060.01.34.06'],
            ['060.01.34.05.03', '060.01.34.06'],
            ['060.01.34.05.04', '060.01.34.06'],

            // POLRESTA SORONG KOTA / POLDA PAPUA BARAT DAYA.
            ['060.01.33.06.01', '060.01.36.101'],
            ['060.01.33.06.02', '060.01.36.101'],
            ['060.01.33.06.04', '060.01.36.101'],
            ['060.01.33.06.18', '060.01.36.101'],
            ['060.01.33.06.06', '060.01.36.101'],
            ['060.01.33.07', '060.01.36'],
            ['060.01.36.03.01', '060.01.33.07'],
            ['060.01.36.03.02', '060.01.33.07'],
            ['060.01.36.03.03', '060.01.33.07'],
            ['060.01.36.03.05', '060.01.33.07'],
            ['060.01.36.03.07', '060.01.33.07'],
            ['060.01.36.03.06', '060.01.36.28'],
            ['060.01.33.07.07.06', '060.01.36.28'],
            ['060.01.33.08', '060.01.36'],

            // POLRES MAYBRAT / POLRES SORONG SELATAN.
            ['060.01.36.05.01', '060.01.36.27'],
            ['060.01.36.05.02', '060.01.36.27'],
            ['060.01.36.05.03', '060.01.36.27'],
            ['060.01.36.05.04', '060.01.36.27'],
            ['060.01.33.08.04.06', '060.01.36.27'],
            ['060.01.33.08.03.06', '060.01.36.27'],
            ['060.01.33.08.02.06', '060.01.36.27'],
            ['060.01.33.08.06.06', '060.01.36.27'],
            ['060.01.36.05.05', '060.01.33.08'],
            ['060.01.36.05.06', '060.01.33.08'],
            ['060.01.36.05.07', '060.01.33.08'],
            ['060.01.33.08.05.06', '060.01.33.08'],
            ['060.01.33.08.07.06', '060.01.33.08'],
            ['060.01.33.08.01.06', '060.01.33.08'],

            // POLDA PAPUA TENGAH.
            ['060.01.32.20', '060.01.37'],
            ['060.01.32.16', '060.01.37'],
            ['060.01.37.02.01', '060.01.32.20'],
            ['060.01.37.02.02', '060.01.32.20'],
            ['060.01.37.02.05', '060.01.32.20'],
            ['060.01.37.02.06', '060.01.32.20'],
            ['060.01.37.02.07', '060.01.32.20'],
            ['060.01.37.02.08', '060.01.32.20'],
            ['060.01.37.02.09', '060.01.32.20'],
            ['060.01.37.05.03', '060.01.32.16'],
            ['060.01.37.05.04', '060.01.32.16'],

            // POLRES PUNCAK (060.01.32.26) - Polsek Sinak, Ilaga, Beoga historically prefixed 060.01.32.16 (Puncak Jaya)
            ['060.01.32.16.03', '060.01.32.26'], // POLSEK SINAK -> POLRES PUNCAK
            ['060.01.32.16.04', '060.01.32.26'], // POLSEK ILAGA -> POLRES PUNCAK
            ['060.01.32.16.05', '060.01.32.26'], // POLSEK BEOGA -> POLRES PUNCAK

            // POLSEK KAWASAN BANDARA DEO -> POLRESTA SORONG KOTA.
            // Entri ini sudah aktif di dist production; dipertahankan di source agar parity.
            ['060.01.33.06.06', '060.01.36.101'],

            // Delapan Polsek wilayah Kabupaten Sumba Barat Daya masih memakai canonical
            // lineage historis POLRES SUMBA BARAT (060.01.24.07.xx). Parent operasional
            // current adalah POLRES SUMBA BARAT DAYA (060.01.24.18). ID dan canonical
            // dipertahankan agar LP, user, dan mapping DORS tidak terputus.
            ['060.01.24.07.09', '060.01.24.18'], // POLSEK KODI
            ['060.01.24.07.08', '060.01.24.18'], // POLSEK KODI BANGEDO
            ['060.01.24.07.10', '060.01.24.18'], // POLSEK KODI UTARA
            ['060.01.24.07.20', '060.01.24.18'], // POLSEK KOTA TAMBOLAKA
            ['060.01.24.07.07', '060.01.24.18'], // POLSEK LOURA
            ['060.01.24.07.11', '060.01.24.18'], // POLSEK WEWEWA BARAT
            ['060.01.24.07.12', '060.01.24.18'], // POLSEK WEWEWA SELATAN
            ['060.01.24.07.13', '060.01.24.18']  // POLSEK WEWEWA TIMUR
        ]);
        for (const r of all) {
            let pk = this.parentKey(r.kode_canonical.split('.'));
            const overrideParent = hierarchyParentOverrides.get(r.kode_canonical);
            if (overrideParent) {
                if (!canonSet.has(overrideParent)) {
                    throw new Error(`Hierarchy override target tidak ditemukan: ${r.kode_canonical} -> ${overrideParent}`);
                }
                pk = overrideParent;
            } else {
                while (pk && !canonSet.has(pk)) pk = this.parentKey(pk.split('.'));
            }
            parentOf.set(r.kode_canonical, pk);
        }
        const depthOf = (ck: string): number => {
            let d = 1;
            let p = parentOf.get(ck);
            while (p) {
                d++;
                p = parentOf.get(p) ?? null;
            }
            return d;
        };

        const CHUNK = 500;
        for (let i = 0; i < all.length; i += CHUNK) {
            const slice = all.slice(i, i + CHUNK);
            const params: any[] = [];
            const tuples = slice
                .map((r: any, idx: number) => {
                    const ck = r.kode_canonical;
                    const pc = parentOf.get(ck);
                    const pid = pc ? idByCanon.get(pc) ?? rootId : rootId;
                    const b = idx * 4;
                    params.push(r.id, pid, depthOf(ck), pc ?? null);
                    return `($${b + 1}::bigint,$${b + 2}::bigint,$${b + 3}::int,$${b + 4}::text)`;
                })
                .join(',');
            await this.dataSource.query(
                `update bdb_satker s set parent_id=v.pid, root_id=$${params.length + 1}, depth=v.depth, parent_kode=v.pkode, updated_at=now()
                 from (values ${tuples}) as v(id,pid,depth,pkode)
                 where s.id=v.id`,
                [...params, rootId]
            );
        }
        // Struktur berubah (tambah/ubah/hapus/migrasi) -- cache tree KinerjaPerkaraService ikut basi.
        this.kinerjaPerkaraService.clearCache();
        return rootId;
    }

    // ---- CRUD manual ----
    // Kode/segmen dulu dipaksa angka-saja (konvensi Puskarda) -- superadmin punya kode sendiri
    // (kode Puskarda ATAU kode DORS, bisa campur huruf) yg dipakai apa adanya, jadi restriksi
    // itu cuma bikin susah tanpa manfaat nyata. Satu-satunya yg WAJIB dijaga: struktur
    // dot-hierarchy-nya (canon()/rebuildHierarchy() split by '.') -- jadi segmen kosong
    // ("..", diawali/diakhiri ".") tetap ditolak, tapi ISI tiap segmen (angka/huruf/campur) bebas.
    private validKode(kode: string) {
        const s = String(kode || '').trim();
        if (!s) throw new BadRequestException('Kode Puskarda wajib diisi.');
        if (!/^[^.\s]+(\.[^.\s]+)*$/.test(s)) throw new BadRequestException('Kode tidak valid -- pisahkan tiap tingkat dgn titik, jangan ada titik ganda/di ujung, atau spasi (mis. 060.01.12 atau kode DORS Anda sendiri).');
    }
    /** Segmen kode: freetext (boleh angka/huruf/campur, sesuai kode Puskarda/DORS milik sendiri).
     *  Boleh berjenjang dgn titik (mis. "01.37") kalau induk perantaranya belum ada sbg baris
     *  tersendiri -- rebuildHierarchy() sudah bisa menyelipkannya ke leluhur TERDEKAT yg benar2 ada.
     *  Padding ke 2 digit HANYA dilakukan kalau segmennya murni angka (konvensi Puskarda lama) --
     *  segmen custom (huruf/campur) dipakai apa adanya, tak diotak-atik. */
    private normSegment(seg: string): string {
        const s = String(seg).trim();
        if (!/^[^.\s]+(\.[^.\s]+)*$/.test(s)) throw new BadRequestException('Segmen kode tidak valid -- pisahkan tiap tingkat dgn titik, jangan ada titik ganda/di ujung, atau spasi.');
        return s
            .split('.')
            .map((part) => (/^\d{1}$/.test(part) ? '0' + part : part))
            .join('.');
    }

    /**
     * Tambah satker. Dua cara:
     *  - hierarki: kirim parent_id + segment -> kode = kode_canonical induk + "." + segment
     *  - manual  : kirim kode penuh
     */
    async create(body: { kode?: string; deskripsi?: string; parent_id?: number; segment?: string; [k: string]: any }) {
        await this.ensureTable();
        if (!body.deskripsi || !body.deskripsi.trim()) throw new BadRequestException('Nama satker wajib diisi.');
        let kode: string;
        if (body.parent_id !== undefined && body.parent_id !== null && body.segment) {
            const p = await this.dataSource.query('select kode_canonical from bdb_satker where id=$1', [body.parent_id]);
            if (!p.length) throw new BadRequestException('Induk satker tidak ditemukan.');
            kode = `${p[0].kode_canonical}.${this.normSegment(body.segment)}`;
        } else if (body.kode && body.kode.trim()) {
            this.validKode(body.kode);
            kode = body.kode.trim();
        } else {
            throw new BadRequestException('Pilih induk & segmen, atau isi kode Puskarda.');
        }
        const canon = this.canon(kode).join('.');
        const dup = await this.dataSource.query('select id, deskripsi from bdb_satker where kode_canonical=$1', [canon]);
        if (dup.length) throw new BadRequestException(`Kode ${kode} sudah dipakai: ${dup[0].deskripsi}.`);
        const extraCols = SatkerService.EXTRA_COLS;
        const insCols = ['kode', 'kode_canonical', 'deskripsi', ...extraCols, 'keanggotaan', 'fungsi', 'kinerja_aktif', 'urutan'];
        const insVals = [
            kode,
            canon,
            body.deskripsi.trim(),
            ...extraCols.map((c) => this.cellVal((body as any)[c])),
            this.validKlasifikasi('keanggotaan', body.keanggotaan),
            this.validKlasifikasi('fungsi', body.fungsi),
            body.kinerja_aktif === false ? false : true,
            this.cellInt(body.urutan)
        ];
        const ph = insVals.map((_, i) => `$${i + 1}`).join(',');
        const ins = await this.dataSource.query(
            `insert into bdb_satker (${insCols.join(',')}, source, synced_at) values (${ph}, 'MANUAL', now()) returning id`,
            insVals
        );
        await this.rebuildHierarchy();
        // otomatis buat admin operator utk satker baru
        try {
            await this.createAdminForSatker(ins[0].id, kode, canon, body.deskripsi.trim());
        } catch (e: any) {
            this.logger.warn('gagal membuat admin untuk satker baru: ' + (e?.message || e));
        }
        // Satker baru bisa langsung jadi kandidat exact-match utk LP DORS yg sebelumnya
        // "belum termapping" (kode-nya sudah cocok, cuma satkernya belum ada di tree). Jangan
        // nunggu jadwal sync DORS berikutnya (bisa nonaktif/jarang) -- sapu bersih sekarang,
        // di background (tak diawait) supaya respons "Tambah Satker" tak ikut lambat.
        this.laporanPolisiService.mapFromDors().catch((e: any) => this.logger.warn('gagal sapu-ulang LP belum termapping setelah satker baru dibuat: ' + (e?.message || e)));
        return { status: 1, data: { id: ins[0].id, kode }, message: 'Satker ditambahkan.' };
    }

    private cellVal(v: any): string | null {
        if (v === undefined || v === null) return null;
        const s = String(v).trim();
        return s === '' ? null : s;
    }

    /** Urutan tampil (sql/bdb/087) -- integer bebas atau null (belum diatur, jatuh ke akhir via
     *  "nulls last" di query list/children). Diisi manual lewat form Tambah/Ubah Satker supaya
     *  superadmin bisa geser urutan (mis. susunan Polda) tanpa perlu migration/update DB manual. */
    private cellInt(v: any): number | null {
        if (v === undefined || v === null || String(v).trim() === '') return null;
        const n = Number(v);
        if (!Number.isFinite(n) || !Number.isInteger(n)) throw new BadRequestException('Urutan harus berupa angka bulat.');
        return n;
    }

    /** Validasi 2 sumbu klasifikasi -- kosong/undefined dibiarkan (belum diklasifikasi), selain itu HARUS salah satu opsi baku. */
    private validKlasifikasi(field: 'keanggotaan' | 'fungsi', v: any) {
        const val = this.cellVal(v);
        if (val === null) return null;
        const opts = field === 'keanggotaan' ? SatkerService.KEANGGOTAAN_OPTS : SatkerService.FUNGSI_OPTS;
        if (!opts.includes(val)) throw new BadRequestException(`Nilai "${field}" tidak dikenal (pakai: ${opts.join(', ')}).`);
        return val;
    }

    async update(id: number, body: { kode?: string; deskripsi?: string; [k: string]: any }) {
        await this.ensureTable();
        const rows = await this.dataSource.query('select id, kode, kode_canonical, is_synthetic, is_root, tipe_satker from bdb_satker where id=$1', [id]);
        if (!rows.length) throw new NotFoundException('Satker tidak ditemukan.');
        const cur = rows[0];
        let kodeChanged = false;
        let kode = cur.kode as string;
        let canon = cur.kode_canonical as string;
        if (body.kode !== undefined && body.kode.trim() && body.kode.trim() !== cur.kode) {
            if (cur.is_root) throw new BadRequestException('Kode root POLRI tidak dapat diubah.');
            this.validKode(body.kode);
            kode = body.kode.trim();
            canon = this.canon(kode).join('.');
            const dup = await this.dataSource.query('select id from bdb_satker where kode_canonical=$1 and id<>$2', [canon, id]);
            if (dup.length) throw new BadRequestException(`Kode ${kode} sudah dipakai satker lain.`);
            kodeChanged = true;
        }
        const deskripsi = body.deskripsi !== undefined && body.deskripsi.trim() ? body.deskripsi.trim() : undefined;
        if ('jumlah_penduduk' in body && this.cellVal(body.jumlah_penduduk) !== null) {
            const effectiveTipe = 'tipe_satker' in body ? this.cellVal(body.tipe_satker) || 'FUNGSI' : cur.tipe_satker;
            if (effectiveTipe === 'FUNGSI') {
                throw new BadRequestException('Jumlah Penduduk hanya bisa diisi utk satker WILAYAH (Polda/Polres/Polsek) -- satker ini terklasifikasi sbg FUNGSI (satuan organisasi, bukan wilayah geografis sendiri).');
            }
        }
        const sets = ['kode=$1', 'kode_canonical=$2', 'deskripsi=coalesce($3, deskripsi)'];
        const vals: any[] = [kode, canon, deskripsi ?? null];
        for (const c of SatkerService.EXTRA_COLS) {
            if (c in body) {
                vals.push(this.cellVal(body[c]));
                sets.push(`${c}=$${vals.length}`);
            }
        }
        if ('keanggotaan' in body) {
            vals.push(this.validKlasifikasi('keanggotaan', body.keanggotaan));
            sets.push(`keanggotaan=$${vals.length}`);
        }
        if ('fungsi' in body) {
            vals.push(this.validKlasifikasi('fungsi', body.fungsi));
            sets.push(`fungsi=$${vals.length}`);
        }
        if ('kinerja_aktif' in body) {
            vals.push(body.kinerja_aktif !== false);
            sets.push(`kinerja_aktif=$${vals.length}`);
        }
        if ('tipe_satker' in body) {
            const v = this.cellVal(body.tipe_satker) || 'FUNGSI';
            if (!SatkerService.TIPE_SATKER_OPTS.includes(v)) throw new BadRequestException(`Nilai "tipe_satker" tidak dikenal (pakai: ${SatkerService.TIPE_SATKER_OPTS.join(', ')}).`);
            vals.push(v);
            sets.push(`tipe_satker=$${vals.length}`);
        }
        if ('urutan' in body) {
            vals.push(this.cellInt(body.urutan));
            sets.push(`urutan=$${vals.length}`);
        }
        vals.push(id);
        await this.dataSource.query(`update bdb_satker set ${sets.join(', ')}, updated_at=now() where id=$${vals.length}`, vals);
        if (kodeChanged) await this.rebuildHierarchy();
        // jumlah_penduduk/tipe_satker/kinerja_aktif ikut di-cache KinerjaPerkaraService (getSatkerTree)
        // -- rebuildHierarchy() di atas cuma jalan kalau kode berubah, jadi clear terpisah di sini
        // supaya edit Jumlah Penduduk/Tipe Satker langsung kepakai, tak nunggu cache basi (10 menit).
        this.kinerjaPerkaraService.clearCache();
        return { status: 1, message: 'Satker diperbarui.' };
    }

    // level DORS (kunci jml_penduduk ada di objek polda/polres/polsek yg nempel di tiap LP, BUKAN di
    // satker manapun) -> tipe_satker WILAYAH yg sesuai. bdb_satker.dors_kode dicocokkan persis dgn
    // field "kode" objek tsb (mis. "060.08.33" utk POLRES MUSI RAWAS) -- BUKAN kode_pusiknas, field
    // beda yg dipakai utk mapping LP->satker (lihat KP_SQL/DORS_KODE_SQL di laporan-polisi.service.ts).
    private static readonly POPULASI_LEVELS: { jsonKey: string; tipe: string }[] = [
        { jsonKey: 'polda', tipe: 'POLDA' },
        { jsonKey: 'polres', tipe: 'POLRES' },
        { jsonKey: 'polsek', tipe: 'POLSEK' }
    ];

    /**
     * Isi/perbarui Jumlah Penduduk satker WILAYAH (Polda/Polres/Polsek) otomatis dari data DORS --
     * tiap LP membawa objek polda/polres/polsek dgn field jml_penduduk yg sama utk kode yg sama,
     * tapi bisa berubah dari waktu ke waktu (BPS update), jadi selalu ambil nilai TERBARU (by
     * synced_at) per kode, bukan nilai pertama yg ketemu. Dipanggil otomatis tiap sync DORS selesai
     * (lihat DorsService.runSyncJob/syncRange) supaya selalu ter-update, TANPA perlu input manual
     * lagi spt sebelumnya. FUNGSI tak pernah tersentuh (WHERE tipe_satker match persis level DORS-nya).
     */
    async syncPopulasiWilayahDariDors(): Promise<number> {
        await this.ensureTable();
        let updated = 0;
        for (const { jsonKey, tipe } of SatkerService.POPULASI_LEVELS) {
            const ret = await this.dataSource.query(
                `with latest as (
                    select distinct on (lp.payload_json->'${jsonKey}'->>'kode')
                        lp.payload_json->'${jsonKey}'->>'kode' as dkode,
                        nullif(lp.payload_json->'${jsonKey}'->>'jml_penduduk','')::bigint as jml
                    from bdb_laporan_polisi lp
                    where jsonb_typeof(lp.payload_json->'${jsonKey}')='object'
                      and lp.payload_json->'${jsonKey}'->>'kode' is not null
                    order by lp.payload_json->'${jsonKey}'->>'kode', lp.synced_at desc
                 )
                 update bdb_satker s set jumlah_penduduk = latest.jml::text, updated_at = now()
                 from latest
                 where s.tipe_satker = $1 and s.dors_kode = latest.dkode
                   and latest.jml is not null
                   and s.jumlah_penduduk is distinct from latest.jml::text
                 returning s.id`,
                [tipe]
            );
            // UPDATE ... RETURNING via DataSource.query() balikin tuple [rows[], affectedCount], BUKAN
            // array baris langsung (beda dari SELECT) -- ret[0] baris aktual, ret[1] jumlahnya.
            updated += Array.isArray(ret?.[0]) ? ret[0].length : 0;
        }
        if (updated > 0) {
            this.kinerjaPerkaraService.clearCache();
            this.logger.log(`Sinkron Jumlah Penduduk dari DORS: ${updated} satker wilayah diperbarui.`);
        }
        return updated;
    }

    // ---- Data wilayah/demografi SATKER SENDIRI (operator/admin_binops) ----
    // Beda dari update() di atas: id diambil dari sesi (scope_satker_id), bukan dari client, dan
    // HANYA kolom EXTRA_COLS (alamat/lokasi/jumlah_penduduk) yg bisa diubah -- tak pernah kode/deskripsi/
    // hierarki, itu tetap eksklusif superadmin lewat menu Struktur Satker.
    private static readonly SELF_EDIT_ROLES = ['operator', 'admin_binops'];

    private assertSelfEditAllowed(authUser: any): number {
        if (!authUser) throw new UnauthorizedException('Sesi tidak valid.');
        const role = String(authUser.role_bdb || '').toLowerCase();
        if (!SatkerService.SELF_EDIT_ROLES.includes(role)) {
            throw new ForbiddenException('Hanya operator/admin satker yang dapat mengisi data wilayah satker sendiri.');
        }
        const id = authUser.scope_satker_id ? Number(authUser.scope_satker_id) : null;
        if (!id) throw new BadRequestException('Akun Anda tidak memiliki satker melekat.');
        return id;
    }

    private validateGeoBody(body: Record<string, any>) {
        if ('jumlah_penduduk' in body && this.cellVal(body.jumlah_penduduk) !== null) {
            const n = Number(String(body.jumlah_penduduk).replace(/[.,\s]/g, ''));
            if (!Number.isFinite(n) || n < 0) throw new BadRequestException('Jumlah penduduk harus berupa angka >= 0.');
        }
        if ('longitude' in body && this.cellVal(body.longitude) !== null) {
            const n = Number(body.longitude);
            if (!Number.isFinite(n) || n < -180 || n > 180) throw new BadRequestException('Longitude harus angka antara -180 s/d 180.');
        }
        if ('latitude' in body && this.cellVal(body.latitude) !== null) {
            const n = Number(body.latitude);
            if (!Number.isFinite(n) || n < -90 || n > 90) throw new BadRequestException('Latitude harus angka antara -90 s/d 90.');
        }
    }

    /** Data wilayah/demografi satker milik akun yg sedang login (operator/admin_binops). */
    async getMyProfile(authUser: any) {
        await this.ensureTable();
        const id = this.assertSelfEditAllowed(authUser);
        const rows = await this.dataSource.query(
            `select id, kode, deskripsi, alamat, provinsi, kabupaten_kota, kecamatan, desa, kode_pos, longitude, latitude, jumlah_penduduk, tipe_satker
             from bdb_satker where id=$1`,
            [id]
        );
        if (!rows.length) throw new NotFoundException('Satker Anda tidak ditemukan di master data.');
        return { status: 1, data: rows[0] };
    }

    /** Ubah data wilayah/demografi satker milik akun yg sedang login -- HANYA kolom EXTRA_COLS. */
    async updateMyProfile(authUser: any, body: Record<string, any>) {
        await this.ensureTable();
        const id = this.assertSelfEditAllowed(authUser);
        const exists = await this.dataSource.query('select id, tipe_satker from bdb_satker where id=$1', [id]);
        if (!exists.length) throw new NotFoundException('Satker Anda tidak ditemukan di master data.');
        this.validateGeoBody(body);
        if ('jumlah_penduduk' in body && this.cellVal(body.jumlah_penduduk) !== null && exists[0].tipe_satker === 'FUNGSI') {
            throw new BadRequestException('Jumlah Penduduk hanya bisa diisi utk satker WILAYAH (Polda/Polres/Polsek) -- satker Anda terklasifikasi sbg FUNGSI (satuan organisasi, bukan wilayah geografis sendiri).');
        }

        const sets: string[] = [];
        const vals: any[] = [];
        for (const c of SatkerService.EXTRA_COLS) {
            if (c in body) {
                vals.push(this.cellVal(body[c]));
                sets.push(`${c}=$${vals.length}`);
            }
        }
        if (!sets.length) throw new BadRequestException('Tidak ada data untuk disimpan.');
        vals.push(id);
        await this.dataSource.query(`update bdb_satker set ${sets.join(', ')}, updated_at=now() where id=$${vals.length}`, vals);
        this.kinerjaPerkaraService.clearCache(); // jumlah_penduduk ikut di-cache getSatkerTree() -- lihat catatan di update()
        return { status: 1, message: 'Data wilayah satker Anda diperbarui.' };
    }

    // ---- Admin operator otomatis per satker ----
    private static readonly ADMIN_PW_FALLBACK = '$2b$10$GgyvoGVmtv4qZY0Aat.t7.sFr/9PgasbP2sE9mRYidMTFwJJKvjja'; // Bdb12345!

    private adminEmail(canonical: string) {
        return `admin.${canonical.replace(/\./g, '-')}@bdb.local`;
    }

    /** Buat 1 admin operator utk satker (idempotent by scope_satker_id/email). */
    async createAdminForSatker(id: number, kode: string, canonical: string, deskripsi: string) {
        const exists = await this.dataSource.query(`select 1 from auth_users where scope_satker_id=$1 and role_bdb='operator' limit 1`, [id]);
        if (exists.length) return { created: false };
        const email = this.adminEmail(canonical);
        const name = `Admin_${deskripsi}`.slice(0, 255);
        // "organisasiRoleId" (legacy) WAJIB ikut cari id role "operator" dari tm_org_role, JANGAN
        // hardcode -- lihat organisasi-role.util.ts utk riwayat bug fatal kalau field ini nyasar.
        await this.dataSource.query(
            `insert into auth_users
               (name, email, login_method, local_password_enabled, email_verified_at, password, otp, totp,
                role_bdb, requested_role_bdb, scope_satker_id, scope_satker_key, requested_scope_satker_id, requested_scope_satker_key,
                approval_status, status, two_factor_required, email_otp_required, "organisasiId", "organisasiRoleId", created_at, updated_at)
             select $1,$2,'LOCAL',true,now(),
                coalesce((select password from auth_users where email='operator@bdb.local' limit 1), $5),
                false,false,'operator','operator',$3,$4,$3,$4,'APPROVED','AKTIF',false,false,1,
                (select id from tm_org_role where lower(role_name)='operator' and deleted_at is null limit 1),now(),now()
             on conflict (email) do nothing`,
            [name, email, id, kode, SatkerService.ADMIN_PW_FALLBACK]
        );
        return { created: true, email };
    }

    /** Backfill admin operator utk semua satker yang belum punya. */
    async backfillAdmins() {
        await this.ensureTable();
        // "organisasiRoleId" (legacy) WAJIB ikut cari id role "operator" dari tm_org_role, JANGAN
        // hardcode -- lihat organisasi-role.util.ts utk riwayat bug fatal kalau field ini nyasar.
        const ret = await this.dataSource.query(
            `insert into auth_users
               (name, email, login_method, local_password_enabled, email_verified_at, password, otp, totp,
                role_bdb, requested_role_bdb, scope_satker_id, scope_satker_key, requested_scope_satker_id, requested_scope_satker_key,
                approval_status, status, two_factor_required, email_otp_required, "organisasiId", "organisasiRoleId", created_at, updated_at)
             select left('Admin_'||s.deskripsi,255),
                    'admin.'||replace(s.kode_canonical,'.','-')||'@bdb.local',
                    'LOCAL', true, now(),
                    coalesce((select password from auth_users where email='operator@bdb.local' limit 1), $1),
                    false, false, 'operator','operator', s.id, s.kode, s.id, s.kode, 'APPROVED','AKTIF', false, false, 1,
                    (select id from tm_org_role where lower(role_name)='operator' and deleted_at is null limit 1), now(), now()
             from bdb_satker s
             where s.is_synthetic = false
               and not exists (select 1 from auth_users u where u.scope_satker_id = s.id and u.role_bdb='operator')
             on conflict (email) do nothing
             returning id`,
            [SatkerService.ADMIN_PW_FALLBACK]
        );
        const created = Array.isArray(ret) ? ret.length : 0;
        return { status: 1, data: { created }, message: `${created} admin operator dibuat.` };
    }

    async remove(id: number) {
        await this.ensureTable();
        const rows = await this.dataSource.query('select id, is_root, deskripsi, (select count(*)::int from bdb_satker c where c.parent_id=bdb_satker.id) as anak from bdb_satker where id=$1', [id]);
        if (!rows.length) throw new NotFoundException('Satker tidak ditemukan.');
        if (rows[0].is_root) throw new BadRequestException('Root POLRI tidak dapat dihapus.');
        await this.dataSource.query('delete from bdb_satker where id=$1', [id]);
        await this.rebuildHierarchy(); // anak (jika ada) otomatis naik ke ancestor terdekat
        return { status: 1, data: { anak_dipindah: rows[0].anak }, message: rows[0].anak ? `Satker dihapus; ${rows[0].anak} sub-satker dipindah ke induk terdekat.` : 'Satker dihapus.' };
    }

    /** Daftar satker (grid) — paginasi + pencarian + info induk. */
    async list(opts: { search?: string; page?: number; row?: number }) {
        await this.ensureTable();
        const page = Math.max(1, Number(opts.page) || 1);
        const row = Math.max(1, Math.min(1000, Number(opts.row) || 25));
        const offset = (page - 1) * row;
        const params: any[] = [];
        let where = 'where s.is_synthetic=false';
        if (opts.search && opts.search.trim()) {
            params.push(`%${opts.search.trim()}%`);
            where += ` and (lower(s.deskripsi) like lower($${params.length}) or s.kode like $${params.length} or s.dors_kode like $${params.length})`;
        }
        const totalRow = await this.dataSource.query(`select count(*)::int c from bdb_satker s ${where}`, params);
        const total = totalRow[0]?.c || 0;
        params.push(row, offset);
        const rows = await this.dataSource.query(
            `select s.id, s.kode, s.kode_canonical, s.deskripsi, s.depth, s.source,
                s.alamat, s.provinsi, s.kabupaten_kota, s.kecamatan, s.desa, s.kode_pos, s.longitude, s.latitude, s.jumlah_penduduk,
                s.keanggotaan, s.fungsi, s.kinerja_aktif, s.dors_kode, s.tipe_satker, s.urutan,
                p.deskripsi as parent_deskripsi, p.kode as parent_kode,
                (select count(*)::int from bdb_satker c where c.parent_id=s.id) as child_count
             from bdb_satker s
             left join bdb_satker p on p.id=s.parent_id
             ${where}
             order by s.urutan nulls last, s.kode_canonical
             limit $${params.length - 1} offset $${params.length}`,
            params
        );
        return { status: 1, data: rows, total, page, row, total_page: Math.ceil(total / row) };
    }

    /** Toggle cepat "tampil di rekap Kinerja Perkara" langsung dari grid, tanpa buka dialog edit penuh. */
    async setKinerjaAktif(id: number, aktif: boolean) {
        await this.ensureTable();
        // UPDATE ... RETURNING balikin tuple [rows[], affectedCount], bukan array baris langsung.
        const [rows] = await this.dataSource.query('update bdb_satker set kinerja_aktif=$2, updated_at=now() where id=$1 returning id', [id, aktif !== false]);
        if (!rows.length) throw new NotFoundException('Satker tidak ditemukan.');
        // WAJIB -- KinerjaPerkaraService cache daftar satker terkecuali sampai 10 menit
        // (SATKER_CACHE_TTL_MS), tanpa ini toggle di sini kelihatan tak ada efek sampai cache basi.
        this.kinerjaPerkaraService.clearCache();
        return { status: 1, message: aktif !== false ? 'Satker diikutkan lagi ke rekap Kinerja Perkara.' : 'Satker dikeluarkan dari rekap Kinerja Perkara.' };
    }

    /** Jalur id dari root ke node (untuk pra-isi pemilih induk saat edit). */
    async path(id: number) {
        await this.ensureTable();
        const rows = await this.dataSource.query(
            `with recursive up(id,parent_id,lvl) as (
                select id,parent_id,0 from bdb_satker where id=$1
                union all select s.id,s.parent_id,up.lvl+1 from bdb_satker s join up on s.id=up.parent_id
             ) select array_agg(id order by lvl desc) as path from up`,
            [id]
        );
        return { status: 1, data: rows[0]?.path || [] };
    }

    async stats() {
        await this.ensureTable();
        const r = await this.dataSource.query(
            `select
                (select count(*)::int from bdb_satker) as total,
                (select count(*)::int from bdb_satker where is_synthetic=false) as total_satker,
                (select max(depth) from bdb_satker) as max_depth,
                (select max(synced_at) from bdb_satker) as terakhir_sync,
                (select count(*)::int from bdb_satker where parent_id=(select id from bdb_satker where is_root=true limit 1)) as jml_top`
        );
        return { status: 1, data: r[0] };
    }

    /** Node akar (root sintetis POLRI). */
    async roots() {
        await this.ensureTable();
        const rows = await this.dataSource.query(
            `select s.id, s.kode, s.kode_canonical, s.deskripsi, s.depth,
                exists(select 1 from bdb_satker c where c.parent_id=s.id) as has_children,
                (select count(*)::int from bdb_satker c where c.parent_id=s.id) as child_count
             from bdb_satker s where s.is_root=true order by s.id`
        );
        return { status: 1, data: rows };
    }

    /** Anak langsung dari sebuah node (lazy treeview). */
    async children(parentId: number, userId?: number) {
        await this.ensureTable();
        let allowedSql = '';
        const params: any[] = [parentId];

        if (userId) {
            const uRows = await this.dataSource.query(
                `select u.role_bdb, u.role_name, u.scope_satker_id, s.deskripsi, s.tipe_satker
                 from auth_users u
                 left join bdb_satker s on s.id = u.scope_satker_id
                 where u.id = $1`,
                [userId]
            );
            const u = uRows[0];
            const roleBdb = String(u?.role_bdb || '').toLowerCase();
            const roleName = String(u?.role_name || '').toLowerCase();
            const isSuper = roleBdb === 'superadmin' || roleName.includes('super');
            const scopeId = u?.scope_satker_id ? Number(u.scope_satker_id) : null;
            const isMabesLeader = !scopeId || scopeId === 1 || scopeId === 13;

            if (!isSuper && !isMabesLeader && scopeId) {
                params.push(scopeId);
                const scopeParam = `$${params.length}`;
                allowedSql = `
                    and s.id in (
                        with recursive
                        user_satker as (
                            select us.id, us.parent_id, us.deskripsi, us.tipe_satker, us.kode_canonical, p.tipe_satker as parent_tipe
                            from bdb_satker us
                            left join bdb_satker p on p.id = us.parent_id
                            where us.id = ${scopeParam}
                        ),
                        actor_meta as (
                            select us.id, us.parent_id, us.deskripsi, us.tipe_satker, us.parent_tipe,
                                case
                                    when upper(us.deskripsi) ~ 'NARKOBA' then 'NARKOBA'
                                    when upper(us.deskripsi) ~ 'KRIMSUS|TIPIDEKSUS|TIPIDTER|TIPIDKOR|KORTAS' then 'KRIMSUS'
                                    when upper(us.deskripsi) ~ 'SIBER' then 'SIBER'
                                    when upper(us.deskripsi) ~ 'PPA|PPO|RENAKTA' then 'PPA'
                                    when upper(us.deskripsi) ~ 'POLAIR|AIRUD' then 'POLAIR'
                                    when upper(us.deskripsi) ~ 'KRIMUM|TIPIDUM|RESKRIM|RES[[:space:]]*KRIM' then 'RESKRIM'
                                    when us.tipe_satker = 'FUNGSI' then 'OTHER_FUNGSI'
                                    else 'ALL'
                                end as domain_code,
                                case
                                    when (us.parent_id in (1, 13) or us.parent_id is null) and us.tipe_satker = 'FUNGSI' and us.id not in (1, 13) and upper(trim(us.deskripsi)) not in ('BARESKRIM POLRI', 'POLRI (MABES POLRI)', 'MABES POLRI') then 'MABES_DIT'
                                    when us.id in (1, 13) or upper(trim(us.deskripsi)) in ('BARESKRIM POLRI', 'POLRI (MABES POLRI)', 'MABES POLRI') then 'MABES'
                                    when us.tipe_satker = 'POLDA' then 'POLDA'
                                    when us.parent_tipe = 'POLDA' and us.tipe_satker = 'FUNGSI' then 'POLDA_DIT'
                                    when us.tipe_satker = 'POLRES' then 'POLRES'
                                    when us.parent_tipe = 'POLRES' and us.tipe_satker = 'FUNGSI' then 'POLRES_SAT'
                                    when us.tipe_satker = 'POLSEK' then 'POLSEK'
                                    when us.parent_tipe = 'POLSEK' and us.tipe_satker = 'FUNGSI' then 'POLSEK_UNIT'
                                    else 'OTHER'
                                end as unit_level
                            from user_satker us
                        ),
                        territory_root as (
                            select case
                                when m.unit_level in ('MABES', 'OTHER') then 1
                                when m.unit_level in ('MABES_DIT', 'POLSEK_UNIT', 'POLSEK') then us.id
                                when m.unit_level = 'POLRES_SAT' then p.id
                                when m.unit_level = 'POLRES' then us.id
                                when m.unit_level = 'POLDA_DIT' then p.id
                                when m.unit_level = 'POLDA' then us.id
                                else us.id
                            end as root_id,
                            us.id as user_satker_id,
                            m.domain_code,
                            m.unit_level
                            from user_satker us
                            cross join actor_meta m
                            left join bdb_satker p on p.id = us.parent_id
                        ),
                        ancestors as (
                            select ak.id, ak.parent_id from bdb_satker ak join territory_root tr on ak.id = tr.root_id
                            union all
                            select pk.id, pk.parent_id from bdb_satker pk join ancestors a on a.parent_id = pk.id
                        ),
                        polres_with_ppa as (
                            select distinct parent_id as polres_id
                            from bdb_satker
                            where upper(deskripsi) ~ 'PPA|PPO|RENAKTA'
                              and upper(deskripsi) !~ 'NARKOBA|KRIMSUS|SIBER|POLSEK'
                              and tipe_satker = 'FUNGSI'
                        ),
                        descendants as (
                            select dk.id, dk.parent_id, dk.deskripsi, dk.tipe_satker from bdb_satker dk join territory_root tr on dk.id = tr.root_id
                            union all
                            select ck.id, ck.parent_id, ck.deskripsi, ck.tipe_satker from bdb_satker ck join descendants d on ck.parent_id = d.id
                        ),
                        filtered_descendants as (
                            select d.id, d.parent_id, d.deskripsi, d.tipe_satker
                            from descendants d
                            cross join territory_root tr
                            where
                                (tr.unit_level in ('POLSEK_UNIT', 'POLSEK', 'MABES_DIT'))
                                or (d.id = tr.user_satker_id)
                                or (d.tipe_satker in ('POLDA', 'POLRES', 'POLSEK'))
                                or (upper(d.deskripsi) ~ 'UNIT[[:space:]]*RESKRIM')
                                or (
                                    tr.unit_level = 'POLDA_DIT'
                                    and d.parent_id != tr.root_id
                                    and (
                                        (
                                            tr.domain_code = 'NARKOBA'
                                            and upper(d.deskripsi) ~ 'NARKOBA'
                                        )
                                        or (
                                            tr.domain_code in ('RESKRIM', 'KRIMSUS', 'SIBER')
                                            and upper(d.deskripsi) ~ 'SAT[[:space:]]*RESKRIM|SATRESKRIM|RESKRIM'
                                            and upper(d.deskripsi) !~ 'NARKOBA|PPA|PPO'
                                        )
                                        or (
                                            tr.domain_code = 'PPA'
                                            and (
                                                (
                                                    upper(d.deskripsi) ~ 'PPA|PPO|RENAKTA'
                                                    and upper(d.deskripsi) !~ 'NARKOBA|KRIMSUS|SIBER'
                                                )
                                                or (
                                                    upper(d.deskripsi) ~ 'SAT[[:space:]]*RESKRIM|SATRESKRIM|RESKRIM'
                                                    and upper(d.deskripsi) !~ 'NARKOBA|PPA|PPO'
                                                    and d.parent_id not in (select polres_id from polres_with_ppa)
                                                )
                                            )
                                        )
                                        or (
                                            tr.domain_code = 'POLAIR'
                                            and upper(d.deskripsi) ~ 'POLAIR|AIRUD'
                                        )
                                    )
                                )
                                or (
                                    tr.unit_level = 'POLRES_SAT' and (
                                        (
                                            tr.domain_code = 'NARKOBA'
                                            and upper(d.deskripsi) ~ 'NARKOBA'
                                        )
                                        or (
                                            tr.domain_code = 'RESKRIM'
                                            and upper(d.deskripsi) ~ 'RESKRIM|KRIMUM|TIPIDUM'
                                            and upper(d.deskripsi) !~ 'NARKOBA|KRIMSUS|SIBER|PPA|PPO'
                                        )
                                        or (
                                            tr.domain_code = 'PPA'
                                            and upper(d.deskripsi) ~ 'PPA|PPO|RENAKTA'
                                            and upper(d.deskripsi) !~ 'NARKOBA|KRIMSUS|SIBER'
                                        )
                                        or (
                                            tr.domain_code = 'KRIMSUS'
                                            and upper(d.deskripsi) ~ 'KRIMSUS|TIPIDEKSUS|TIPIDTER|TIPIDKOR|KORTAS'
                                            and upper(d.deskripsi) !~ 'NARKOBA|SIBER|PPA|PPO'
                                        )
                                        or (
                                            tr.domain_code = 'SIBER'
                                            and upper(d.deskripsi) ~ 'SIBER'
                                            and upper(d.deskripsi) !~ 'NARKOBA|KRIMSUS|PPA|PPO'
                                        )
                                        or (
                                            tr.domain_code = 'POLAIR'
                                            and upper(d.deskripsi) ~ 'POLAIR|AIRUD'
                                            and upper(d.deskripsi) !~ 'NARKOBA|KRIMSUS|SIBER'
                                        )
                                    )
                                )
                                or (
                                    tr.domain_code = 'ALL'
                                )
                        )
                        select id from ancestors union select id from filtered_descendants
                    )
                `;
            }
        }

        const rows = await this.dataSource.query(
            `select s.id, s.kode, s.kode_canonical, s.deskripsi, s.depth, s.parent_id,
                exists(select 1 from bdb_satker c where c.parent_id=s.id ${allowedSql ? allowedSql.replace(/s\\.id/g, 'c.id') : ''}) as has_children,
                (select count(*)::int from bdb_satker c where c.parent_id=s.id ${allowedSql ? allowedSql.replace(/s\\.id/g, 'c.id') : ''}) as child_count
             from bdb_satker s
             where s.parent_id = $1
               ${allowedSql}
             order by s.urutan nulls last, s.kode_canonical`,
            params
        );
        return { status: 1, data: rows };
    }

    /** Cari satker (deskripsi/kode) + jalur ke root. */
    async search(
        q?: string,
        limit: number = 5,
        page: number = 1,
        userId?: number,
        functionDomain?: string,
        organizationDomain?: string,
        level?: string
    ) {
        await this.ensureTable();
        const { resolveScope } = require('../common/scope.util');
        const cleanLimit = Math.max(1, Math.min(200, Number(limit) || 5));
        const cleanPage = Math.max(1, Number(page) || 1);
        const offset = (cleanPage - 1) * cleanLimit;
        const cleanQ = String(q || '').trim();

        // 1. Cek Cakupan Eksternal Polri
        const isEksternalPolri =
            String(functionDomain || organizationDomain || '').toUpperCase().includes('EKSTERNAL_POLRI');

        if (isEksternalPolri) {
            const params: any[] = [];
            let whereExt = '';
            if (cleanQ) {
                params.push('%' + cleanQ + '%');
                whereExt = 'where lower(e.nama) like lower($' + params.length + ')';
            }
            const countRows = await this.dataSource.query(
                'select count(*)::int as c from bdb_satker_eksternal e ' + whereExt,
                params
            );
            const total = countRows[0]?.c ? Number(countRows[0].c) : 0;
            params.push(cleanLimit, offset);
            const extRows = await this.dataSource.query(
                'select e.id, null as kode, e.nama as deskripsi, 0 as depth, \'EKSTERNAL\' as tipe_satker, ' +
                '\'NOT_APPLICABLE\' as function_domain, \'EKSTERNAL_POLRI\' as organization_domain, ' +
                'e.nama as jalur, array[e.id] as path_ids ' +
                'from bdb_satker_eksternal e ' +
                whereExt + ' ' +
                'order by e.nama ' +
                'limit $' + (params.length - 1) + ' offset $' + params.length,
                params
            );
            return {
                status: 1,
                data: extRows,
                total,
                page: cleanPage,
                limit: cleanLimit,
                total_page: Math.ceil(total / cleanLimit)
            };
        }

        // 2. Evaluasi Scope Pengguna & Spesialisasi Fungsi (Domain Affinity & Regional Territory)
        const scope = await resolveScope(this.dataSource, userId);
        let actorDomain = 'ALL';
        let territoryId: number | null = null;
        let territoryLevel = 'MABES';
        let allowedSubordinateLevels: string[] = [];

        if (!scope.all) {
            if (!scope.satkerId) {
                return { status: 1, data: [], total: 0, page: cleanPage, limit: cleanLimit, total_page: 0 };
            }

            const actorRows = await this.dataSource.query('select id, deskripsi, tipe_satker from bdb_satker where id=$1', [scope.satkerId]);
            const desc = String(actorRows[0]?.deskripsi || '').toUpperCase();

            if (/NARKOBA/.test(desc)) actorDomain = 'NARKOBA';
            else if (/KRIMSUS|TIPIDEKSUS|TIPIDTER|KORTAS|TIPIDKOR/.test(desc)) actorDomain = 'KRIMSUS';
            else if (/SIBER/.test(desc)) actorDomain = 'SIBER';
            else if (/PPA|RENAKTA/.test(desc)) actorDomain = 'PPA';
            else if (/KRIMUM|TIPIDUM|RESKRIM|RES\s*KRIM/.test(desc)) actorDomain = 'TIPIDUM';
            else actorDomain = 'ALL';

            const ancestors = await this.dataSource.query(
                `with recursive p as (
                    select id::int, deskripsi, parent_id::int, tipe_satker, depth::int from bdb_satker where id=$1
                    union all
                    select s.id::int, s.deskripsi, s.parent_id::int, s.tipe_satker, s.depth::int from bdb_satker s join p on p.parent_id=s.id
                 ) select id, deskripsi, parent_id, tipe_satker, depth from p order by depth desc nulls last`,
                [scope.satkerId]
            );

            // Cari ancestor teritorial terdekat (POLSEK, POLRES, POLDA, MABES)
            const terr = ancestors.find((x: any) =>
                ['POLSEK', 'POLRES', 'POLDA', 'MABES'].includes(String(x.tipe_satker || '').toUpperCase())
            ) || ancestors.find((x: any) => x.id === 1 || x.id === 13);

            territoryId = terr ? terr.id : 1;
            if (territoryId === 1 || territoryId === 13 || String(terr?.tipe_satker || '').toUpperCase() === 'MABES') {
                territoryLevel = 'MABES';
            } else {
                territoryLevel = terr ? String(terr.tipe_satker || 'POLDA').toUpperCase() : 'POLDA';
            }

            if (territoryLevel === 'MABES') allowedSubordinateLevels = ['POLDA', 'POLRES', 'POLSEK'];
            else if (territoryLevel === 'POLDA') allowedSubordinateLevels = ['POLRES', 'POLSEK'];
            else if (territoryLevel === 'POLRES') allowedSubordinateLevels = ['POLSEK'];
            else allowedSubordinateLevels = [];
        }

                // 3. Bangun Pool Satker Berbasis Master Data Murni (Taxonomy R11)
        const params: any[] = [];
        const whereClauses: string[] = ['s.is_synthetic = false'];
        let cteAllowed = '';
        const fromSource = 'pool s';

        if (!scope.all && territoryLevel !== 'MABES' && territoryId) {
            // Regional Scope (Polda / Polres / Polsek)
            params.push(territoryId);
            const pTerr = params.length;
            params.push(scope.satkerId);
            const pActor = params.length;

            cteAllowed =
                "with recursive sub as (" +
                "select s.id, s.kode, s.deskripsi, s.parent_id, s.depth, s.function_domain, s.organization_domain, s.kode_canonical, s.dors_kode, s.is_synthetic, s.tipe_satker " +
                "from bdb_satker s " +
                "where s.id = $" + pTerr + " or s.id = $" + pActor + " " +
                "union all " +
                "select s.id, s.kode, s.deskripsi, s.parent_id, s.depth, s.function_domain, s.organization_domain, s.kode_canonical, s.dors_kode, s.is_synthetic, s.tipe_satker " +
                "from bdb_satker s " +
                "join sub on s.parent_id = sub.id" +
                "), " +
                "pool as (" +
                "select distinct on (s.id) " +
                "s.id, s.kode, s.deskripsi, s.parent_id, s.depth, " +
                "s.function_domain, s.organization_domain, s.kode_canonical, s.dors_kode, s.is_synthetic, " +
                "case " +
                "when s.depth <= 1 and (s.tipe_satker = 'MABES' or s.id in (1, 13) or p.id in (1, 13)) then 'MABES' " +
                "when s.tipe_satker in ('MABES', 'POLDA', 'POLRES', 'POLSEK') then s.tipe_satker " +
                "when p.tipe_satker in ('MABES', 'POLDA', 'POLRES', 'POLSEK') then p.tipe_satker " +
                "else coalesce(p.tipe_satker, s.tipe_satker) " +
                "end as tipe_satker " +
                "from sub s " +
                "left join bdb_satker p on p.id = s.parent_id " +
                "where s.is_synthetic = false " +
                "and s.organization_domain = 'INTERNAL_POLRI' " +
                "and s.function_domain in ('INTERNAL_RESERSE', 'STRUCTURAL')" +
                "), ";
        } else {
            // Akses Nasional (Mabes / Superadmin / Admin Binops)
            cteAllowed =
                "with pool as (" +
                "select " +
                "s.id, s.kode, s.deskripsi, s.parent_id, s.depth, " +
                "s.function_domain, s.organization_domain, s.kode_canonical, s.dors_kode, s.is_synthetic, " +
                "case " +
                "when s.depth <= 1 and (s.tipe_satker = 'MABES' or s.id in (1, 13) or p.id in (1, 13)) then 'MABES' " +
                "when s.tipe_satker in ('MABES', 'POLDA', 'POLRES', 'POLSEK') then s.tipe_satker " +
                "when p.tipe_satker in ('MABES', 'POLDA', 'POLRES', 'POLSEK') then p.tipe_satker " +
                "else coalesce(p.tipe_satker, s.tipe_satker) " +
                "end as tipe_satker " +
                "from bdb_satker s " +
                "left join bdb_satker p on p.id = s.parent_id " +
                "where s.is_synthetic = false " +
                "and s.organization_domain = 'INTERNAL_POLRI' " +
                "and s.function_domain in ('INTERNAL_RESERSE', 'STRUCTURAL')" +
                "), ";
        }

        // 4. Pencarian Fleksibel (Tokenized Search & Normalisasi Kata/Singkatan)
        if (cleanQ) {
            const tokens = cleanQ.split(/\s+/).filter(Boolean);
            if (tokens.length > 0) {
                const tokenConds: string[] = [];
                for (const t of tokens) {
                    params.push('%' + t + '%');
                    const pRaw = params.length;

                    const cleanT = t.toLowerCase().replace(/dan/g, '').replace(/\s+/g, '');
                    params.push('%' + cleanT + '%');
                    const pClean = params.length;

                    let abbrCondition = '';
                    const lowerT = t.toLowerCase();
                    if (lowerT === 'jakbar') abbrCondition = " or lower(s.deskripsi) like '%jakarta barat%'";
                    else if (lowerT === 'jakpus') abbrCondition = " or lower(s.deskripsi) like '%jakarta pusat%'";
                    else if (lowerT === 'jaksel') abbrCondition = " or lower(s.deskripsi) like '%jakarta selatan%'";
                    else if (lowerT === 'jaktim') abbrCondition = " or lower(s.deskripsi) like '%jakarta timur%'";
                    else if (lowerT === 'jakut') abbrCondition = " or lower(s.deskripsi) like '%jakarta utara%'";

                    tokenConds.push(
                        '(' +
                        'lower(s.deskripsi) like lower($' + pRaw + ') ' +
                        'or replace(replace(lower(s.deskripsi), \'dan\', \'\'), \' \', \'\') like lower($' + pClean + ') ' +
                        'or s.kode like $' + pRaw + ' ' +
                        'or coalesce(s.dors_kode, \'\') like $' + pRaw +
                        abbrCondition +
                        ')'
                    );
                }
                whereClauses.push('(' + tokenConds.join(' and ') + ')');
            }
        }

        if (functionDomain) {
            const fd = functionDomain.trim().toUpperCase();
            if (fd === 'INTERNAL_RESERSE') {
                params.push(['INTERNAL_RESERSE', 'STRUCTURAL']);
                whereClauses.push('s.function_domain = any($' + params.length + ')');
            } else if (fd === 'EKSTERNAL_RESERSE') {
                params.push(['EKSTERNAL_RESERSE']);
                whereClauses.push('s.function_domain = any($' + params.length + ')');
            }
        }

        if (level) {
            const levels = level
                .split(',')
                .map((x) => x.trim().toUpperCase())
                .filter(Boolean);
            if (levels.length > 0 && levels.length < 4) {
                params.push(levels);
                whereClauses.push('upper(s.tipe_satker) = any($' + params.length + ')');
            }
        }

        params.push(cleanLimit);
        const limitParam = '$' + params.length;
        params.push(offset);
        const offsetParam = '$' + params.length;
        const whereSql = whereClauses.length > 0 ? 'where ' + whereClauses.join(' and ') : '';

        const sql =
            cteAllowed +
            'filtered as (' +
            'select s.id, s.kode, s.deskripsi, s.parent_id, s.depth, s.tipe_satker, s.function_domain, s.organization_domain, s.kode_canonical, ' +
            'count(*) over()::int as full_count ' +
            'from ' + fromSource + ' ' +
            whereSql + ' ' +
            '), ' +
            'paged as (' +
            'select * from filtered ' +
            'order by depth, coalesce(kode_canonical, kode) ' +
            'limit ' + limitParam + ' offset ' + offsetParam + ' ' +
            ') ' +
            'select p.id, p.kode, p.deskripsi, p.depth, p.tipe_satker, p.function_domain, p.organization_domain, p.full_count, ' +
            '(with recursive up(id,kode,deskripsi,parent_id,lvl) as (' +
            'select s.id,s.kode,s.deskripsi,s.parent_id,0 from bdb_satker s where s.id=p.id ' +
            'union all select s.id,s.kode,s.deskripsi,s.parent_id,up.lvl+1 from bdb_satker s join up on s.id=up.parent_id' +
            ') select string_agg(deskripsi,\' > \' order by lvl desc) from up) as jalur, ' +
            '(with recursive up2(id,parent_id,lvl) as (' +
            'select s.id,s.parent_id,0 from bdb_satker s where s.id=p.id ' +
            'union all select s.id,s.parent_id,up2.lvl+1 from bdb_satker s join up2 on s.id=up2.parent_id' +
            ') select array_agg(id order by lvl desc) from up2) as path_ids ' +
            'from paged p';

        const rows = await this.dataSource.query(sql, params);
        let total = rows.length > 0 ? Number(rows[0].full_count) : 0;
        if (rows.length === 0 && offset > 0) {
            const countSql = cteAllowed + 'select count(*)::int as c from ' + fromSource + ' ' + whereSql;
            const countRows = await this.dataSource.query(countSql, params.slice(0, params.length - 2));
            total = countRows[0]?.c ? Number(countRows[0].c) : 0;
        }
        return {
            status: 1,
            data: rows,
            total,
            page: cleanPage,
            limit: cleanLimit,
            total_page: Math.ceil(total / cleanLimit)
        };
    }

}
