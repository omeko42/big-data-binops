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

    async ensureTable() {
        await this.dataSource.query(`
            create table if not exists bdb_satker (
                id bigserial primary key,
                kode text not null,
                kode_canonical text not null,
                deskripsi text,
                parent_id bigint references bdb_satker(id) on delete set null,
                root_id bigint references bdb_satker(id) on delete set null,
                parent_kode text,
                depth integer not null default 0,
                is_root boolean not null default false,
                is_synthetic boolean not null default false,
                source text not null default 'ROBINOPS',
                synced_at timestamp not null default now(),
                created_at timestamp not null default now(),
                updated_at timestamp not null default now()
            );
            create unique index if not exists bdb_satker_kode_canonical_uidx on bdb_satker (kode_canonical);
            create index if not exists bdb_satker_parent_idx on bdb_satker (parent_id);
            create index if not exists bdb_satker_root_idx on bdb_satker (root_id);
            create index if not exists bdb_satker_desk_idx on bdb_satker (lower(deskripsi));
            -- kolom lokasi/alamat (dikelola manual)
            alter table bdb_satker add column if not exists alamat text;
            alter table bdb_satker add column if not exists provinsi text;
            alter table bdb_satker add column if not exists kabupaten_kota text;
            alter table bdb_satker add column if not exists kecamatan text;
            alter table bdb_satker add column if not exists desa text;
            alter table bdb_satker add column if not exists kode_pos text;
            alter table bdb_satker add column if not exists longitude text;
            alter table bdb_satker add column if not exists latitude text;
            -- jumlah_penduduk: dasar hitung Crime Rate (lihat KinerjaPerkaraService) -- diisi manual per
            -- satker LEAF (tanpa anak) supaya rollup nasional tidak dobel-hitung antar level hierarki.
            alter table bdb_satker add column if not exists jumlah_penduduk text;
            -- klasifikasi (superadmin-only, BUKAN self-service) -- 2 sumbu independen:
            -- keanggotaan = bagian dari organisasi Polri atau bukan; fungsi = unit reserse atau bukan.
            alter table bdb_satker add column if not exists keanggotaan text;
            alter table bdb_satker add column if not exists fungsi text;
            -- kinerja_aktif: apakah LP satker ini ikut dihitung di rekap Kinerja Perkara (CT/CP/CC/CR) --
            -- default true (semua tampil) spy tak ada yg tiba2 hilang dari rekap saat fitur ini rilis.
            alter table bdb_satker add column if not exists kinerja_aktif boolean not null default true;
            -- tipe_satker: POLDA/POLRES/POLSEK (wilayah geografis nyata) vs FUNGSI (satuan
            -- organisasi, mis. SAT RESKRIM/BAG OPS -- BUKAN wilayah sendiri). Dasar validasi Jumlah
            -- Penduduk (lihat sql/bdb/068) supaya rekap Crime Rate tidak dobel-hitung. Auto-terisi
            -- lewat trigger di bawah utk baris baru, backfill 1x utk baris lama yg msh default.
            alter table bdb_satker add column if not exists tipe_satker text not null default 'FUNGSI';
            create index if not exists bdb_satker_tipe_idx on bdb_satker (tipe_satker);
        `);
        // Trigger + backfill 1x -- dibungkus cek "trigger sudah ada?" supaya SETELAH pertama kali
        // (baris lama sudah dibackfill), pemanggilan ensureTable() berikutnya (tiap request, lihat
        // pola di seluruh service ini) tidak lagi scan+regex 15rb+ baris percuma tiap kali.
        await this.dataSource.query(`
            do $$ begin
                if not exists (select 1 from pg_trigger where tgname = 'trg_bdb_satker_auto_tipe') then
                    if not exists (select 1 from pg_constraint where conname = 'chk_satker_tipe') then
                        alter table bdb_satker add constraint chk_satker_tipe check (tipe_satker in ('POLDA','POLRES','POLSEK','FUNGSI'));
                    end if;
                    update bdb_satker set tipe_satker = 'POLDA' where tipe_satker <> 'POLDA' and deskripsi ~* '^POLDA ';
                    update bdb_satker set tipe_satker = 'POLRES' where tipe_satker <> 'POLRES' and deskripsi ~* '^POLRES(TA|TABES)? ';
                    update bdb_satker set tipe_satker = 'POLSEK' where tipe_satker <> 'POLSEK' and deskripsi ~* '^POLSEK(TA)? ';

                    create or replace function bdb_satker_auto_tipe() returns trigger as $f$
                    begin
                        new.tipe_satker := case
                            when new.deskripsi ~* '^POLDA ' then 'POLDA'
                            when new.deskripsi ~* '^POLRES(TA|TABES)? ' then 'POLRES'
                            when new.deskripsi ~* '^POLSEK(TA)? ' then 'POLSEK'
                            else 'FUNGSI'
                        end;
                        return new;
                    end;
                    $f$ language plpgsql;

                    create trigger trg_bdb_satker_auto_tipe
                        before insert on bdb_satker
                        for each row execute function bdb_satker_auto_tipe();
                end if;
            end $$;
        `);
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
        for (const r of all) {
            let pk = this.parentKey(r.kode_canonical.split('.'));
            while (pk && !canonSet.has(pk)) pk = this.parentKey(pk.split('.'));
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
    async children(parentId: number) {
        await this.ensureTable();
        const rows = await this.dataSource.query(
            `select s.id, s.kode, s.kode_canonical, s.deskripsi, s.depth, s.parent_id,
                exists(select 1 from bdb_satker c where c.parent_id=s.id) as has_children,
                (select count(*)::int from bdb_satker c where c.parent_id=s.id) as child_count
             from bdb_satker s where s.parent_id=$1 order by s.urutan nulls last, s.kode_canonical`,
            [parentId]
        );
        return { status: 1, data: rows };
    }

    /** Cari satker (deskripsi/kode) + jalur ke root. */
    async search(q: string, limit = 50) {
        await this.ensureTable();
        if (!q || !q.trim()) return { status: 1, data: [] };
        const rows = await this.dataSource.query(
            `with recursive found as (
                select id, kode, deskripsi, parent_id, depth
                from bdb_satker
                where lower(deskripsi) like lower($1) or kode like $1
                order by depth, kode_canonical limit $2
            )
            select f.id, f.kode, f.deskripsi, f.depth,
                (with recursive up(id,kode,deskripsi,parent_id,lvl) as (
                    select s.id,s.kode,s.deskripsi,s.parent_id,0 from bdb_satker s where s.id=f.id
                    union all select s.id,s.kode,s.deskripsi,s.parent_id,up.lvl+1 from bdb_satker s join up on s.id=up.parent_id
                 ) select string_agg(deskripsi,' > ' order by lvl desc) from up) as jalur,
                (with recursive up2(id,parent_id,lvl) as (
                    select s.id,s.parent_id,0 from bdb_satker s where s.id=f.id
                    union all select s.id,s.parent_id,up2.lvl+1 from bdb_satker s join up2 on s.id=up2.parent_id
                 ) select array_agg(id order by lvl desc) from up2) as path_ids
            from found f`,
            [`%${q.trim()}%`, Math.max(1, Math.min(200, Number(limit) || 50))]
        );
        return { status: 1, data: rows };
    }
}
