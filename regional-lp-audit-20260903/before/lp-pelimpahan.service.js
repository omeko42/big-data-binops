"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LpPelimpahanService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const scope_util_1 = require("../common/scope.util");
const id_cipher_util_1 = require("../laporan-polisi/id-cipher.util");
const minio_service_1 = require("../kerma/minio.service");
const lp_scope_util_1 = require("../common/lp-scope.util");
let LpPelimpahanService = class LpPelimpahanService {
    dataSource;
    minio;
    logger = new common_1.Logger('LpPelimpahanService');
    constructor(dataSource, minio) {
        this.dataSource = dataSource;
        this.minio = minio;
    }
    schemaCheck = null;
    async ensureTable() {
        if (!this.schemaCheck) {
            this.schemaCheck = (async () => {
                await this.dataSource.query(`select id,lp_id,satker_asal_id,satker_tujuan_id,
                    satker_eksternal_id,satker_eksternal_nama,nomor_dokumen,tanggal_dokumen
                    from bdb_lp_pelimpahan where false`);
                await this.dataSource.query(`select id,pelimpahan_id,file_name,object_key,content_type,size
                    from bdb_lp_pelimpahan_attachments where false`);
                await this.dataSource.query(`select sudah_dilimpahkan,dilimpahkan_eksternal
                    from bdb_laporan_polisi where false`);
            })().catch((error) => { this.schemaCheck = null; throw error; });
        }
        await this.schemaCheck;
    }
    async ensureTableForMigration() {
        await this.dataSource.query(`
            create table if not exists bdb_lp_pelimpahan (
                id bigserial primary key,
                lp_id bigint not null references bdb_laporan_polisi(id) on delete cascade,
                satker_asal_id bigint not null references bdb_satker(id),
                satker_asal_nama text,
                satker_tujuan_id bigint references bdb_satker(id),
                satker_tujuan_nama text,
                keterangan text,
                dilimpahkan_oleh bigint references auth_users(id),
                dilimpahkan_oleh_nama text,
                created_at timestamp not null default now()
            );
            create index if not exists bdb_lp_pelimpahan_lp_idx on bdb_lp_pelimpahan(lp_id);
            create index if not exists bdb_lp_pelimpahan_asal_idx on bdb_lp_pelimpahan(satker_asal_id);
            create index if not exists bdb_lp_pelimpahan_tujuan_idx on bdb_lp_pelimpahan(satker_tujuan_id);
            alter table bdb_lp_pelimpahan alter column satker_tujuan_id drop not null;
            alter table bdb_lp_pelimpahan add column if not exists satker_eksternal_id bigint references bdb_satker_eksternal(id);
            alter table bdb_lp_pelimpahan add column if not exists satker_eksternal_nama text;
            create index if not exists bdb_lp_pelimpahan_eksternal_idx on bdb_lp_pelimpahan(satker_eksternal_id);
            do $$ begin
                if not exists (select 1 from pg_constraint where conname = 'chk_lp_pelimpahan_tujuan') then
                    alter table bdb_lp_pelimpahan add constraint chk_lp_pelimpahan_tujuan check (
                        (satker_tujuan_id is not null and satker_eksternal_id is null)
                        or (satker_tujuan_id is null and satker_eksternal_id is not null)
                    );
                end if;
            end $$;
            alter table bdb_laporan_polisi add column if not exists sudah_dilimpahkan boolean not null default false;
            create index if not exists bdb_laporan_polisi_dilimpahkan_idx on bdb_laporan_polisi(sudah_dilimpahkan);
            alter table bdb_laporan_polisi add column if not exists dilimpahkan_eksternal boolean not null default false;
            create index if not exists bdb_laporan_polisi_dilimpahkan_eksternal_idx on bdb_laporan_polisi(dilimpahkan_eksternal);
            alter table bdb_lp_pelimpahan add column if not exists nomor_dokumen text;
            alter table bdb_lp_pelimpahan add column if not exists tanggal_dokumen date;
            create table if not exists bdb_lp_pelimpahan_attachments (
                id bigserial primary key,
                pelimpahan_id bigint not null references bdb_lp_pelimpahan(id) on delete cascade,
                file_name text not null,
                object_key text not null,
                content_type text,
                size bigint,
                created_at timestamptz not null default now()
            );
            create index if not exists idx_lp_pelimpahan_attachments_parent on bdb_lp_pelimpahan_attachments(pelimpahan_id);
        `);
    }
    async lpRow(lpId) {
        const rows = await this.dataSource.query('select id, satker_id, satker_nama, unit_satker_id, unit_satker_nama, no_laporan from bdb_laporan_polisi where id=$1', [lpId]);
        return rows[0] || null;
    }
    async allowedTargets(lpId) {
        const lp = await this.lpRow(lpId);
        if (!lp)
            throw new common_1.NotFoundException('LP tidak ditemukan.');

        const ownerId = (0, lp_scope_util_1.effectiveLpOwnerId)(lp);

        if (!ownerId)
            return {
                status: 1,
                data: { induk: [], anak: [], sesama: [] }
            };

        const poldaId = await this.poldaRootId(ownerId);

        /*
         * Untuk LP di struktur Polda:
         * user memilih LANGSUNG unit/fungsi tujuan.
         *
         * induk  = fungsi di bawah POLDA  (DIT ...)
         * anak   = fungsi di bawah POLRES (SAT ...)
         * sesama = fungsi di bawah POLSEK (UNIT ...)
         *
         * Shape response lama dipertahankan agar FE production
         * tetap kompatibel.
         */
        if (poldaId) {
            const rows =
                await this.operationalTargetsUnderPolda(
                    poldaId,
                    ownerId
                );

            const mabes =
                await this.mabesPelimpahanTargets();

            return {
                status: 1,
                data: {
                    induk: [
                        ...mabes,
                        ...rows.filter(
                            (r) =>
                                String(
                                    r.parent_tipe || ''
                                ).toUpperCase() === 'POLDA'
                        )
                    ],

                    anak: rows.filter(
                        (r) =>
                            String(
                                r.parent_tipe || ''
                            ).toUpperCase() === 'POLRES'
                    ),

                    sesama: rows.filter(
                        (r) =>
                            String(
                                r.parent_tipe || ''
                            ).toUpperCase() === 'POLSEK'
                    ),
                },
            };
        }

        /*
         * Fallback untuk struktur non-Polda yang belum diaudit:
         * behavior lama dipertahankan.
         */
        const current =
            await this.dataSource.query(
                'select id, kode, deskripsi, parent_id from bdb_satker where id=$1',
                [ownerId]
            );

        if (!current.length)
            return {
                status: 1,
                data: { induk: [], anak: [], sesama: [] }
            };

        const c = current[0];

        const induk = c.parent_id
            ? await this.dataSource.query(
                'select id, kode, deskripsi from bdb_satker where id=$1',
                [c.parent_id]
            )
            : [];

        const anak =
            await this.dataSource.query(
                'select id, kode, deskripsi from bdb_satker where parent_id=$1 order by deskripsi',
                [c.id]
            );

        const sesama = c.parent_id
            ? await this.dataSource.query(
                'select id, kode, deskripsi from bdb_satker where parent_id=$1 and id != $2 order by deskripsi',
                [c.parent_id, c.id]
            )
            : [];

        return {
            status: 1,
            data: { induk, anak, sesama }
        };
    }

    async poldaRootId(satkerId) {
        const rows =
            await this.dataSource.query(
                "with recursive anc as (" +
                " select id,parent_id,tipe_satker,deskripsi,0 as depth" +
                " from bdb_satker where id=$1" +
                " union all" +
                " select p.id,p.parent_id,p.tipe_satker,p.deskripsi,a.depth+1" +
                " from bdb_satker p" +
                " join anc a on a.parent_id=p.id" +
                ")" +
                " select id from anc" +
                " where upper(coalesce(tipe_satker,''))='POLDA'" +
                "    or upper(coalesce(deskripsi,'')) like 'POLDA %'" +
                " order by depth limit 1",
                [satkerId]
            );

        return rows.length
            ? Number(rows[0].id)
            : null;
    }

    async mabesPelimpahanTargets() {
        return this.dataSource.query(
            "select" +
            " s.id," +
            " s.kode," +
            " s.deskripsi," +
            " s.parent_id," +
            " 'MABES'::text as parent_tipe" +
            " from bdb_satker s" +
            " where s.pelimpahan_target_aktif=true" +
            "   and s.dors_mapping_aktif=true" +
            "   and coalesce(s.is_synthetic,false)=false" +
            " order by s.deskripsi"
        );
    }

    async operationalTargetsUnderPolda(
        poldaId,
        currentOwnerId
    ) {
        return this.dataSource.query(
            "with recursive tree as (" +
            " select id,parent_id,kode,deskripsi,tipe_satker," +
            "        dors_mapping_aktif,is_synthetic" +
            " from bdb_satker where id=$1" +

            " union all" +

            " select c.id,c.parent_id,c.kode,c.deskripsi,c.tipe_satker," +
            "        c.dors_mapping_aktif,c.is_synthetic" +
            " from bdb_satker c" +
            " join tree t on c.parent_id=t.id" +
            " where c.dors_mapping_aktif=true" +
            ")" +

            " select" +
            "   s.id," +
            "   s.kode," +
            "   s.deskripsi," +
            "   s.parent_id," +
            "   upper(coalesce(p.tipe_satker,'')) as parent_tipe" +

            " from tree s" +
            " join bdb_satker p on p.id=s.parent_id" +

            " where s.id<>$2" +
            "   and s.dors_mapping_aktif=true" +
            "   and coalesce(s.is_synthetic,false)=false" +
            "   and upper(coalesce(s.tipe_satker,''))='FUNGSI'" +

            "   and (" +
            "        upper(s.deskripsi) like 'UNIT RESKRIM%'" +
            "     or upper(s.deskripsi) like 'UNIT LANTAS%'" +
            "     or upper(s.deskripsi) like 'SAT RESKRIM%'" +
            "     or upper(s.deskripsi) like 'SAT NARKOBA%'" +
            "     or upper(s.deskripsi) like 'SAT PPA%'" +
            "     or upper(s.deskripsi) like 'DIT KRIMUM%'" +
            "     or upper(s.deskripsi) like 'DIT KRIMSUS%'" +
            "     or upper(s.deskripsi) like 'DIT RESKRIMSUS%'" +
            "     or upper(s.deskripsi) like 'DIT RESKRIMUM%'" +
            "     or upper(s.deskripsi) like 'DIT NARKOBA%'" +
            "     or upper(s.deskripsi) like 'DIT RESNARKOBA%'" +
            "     or upper(s.deskripsi) like 'DIT SIBER%'" +
            "     or upper(s.deskripsi) like 'DIT RES SIBER%'" +
            "     or upper(s.deskripsi) like 'DIT RESSIBER%'" +
            "   )" +

            " order by" +
            "   case upper(coalesce(p.tipe_satker,''))" +
            "     when 'POLDA' then 1" +
            "     when 'POLRES' then 2" +
            "     when 'POLSEK' then 3" +
            "     else 9" +
            "   end," +
            "   s.deskripsi",

            [poldaId, currentOwnerId]
        );
    }

    async isAllowedTarget(
        currentSatkerId,
        targetSatkerId
    ) {
        const currentPolda =
            await this.poldaRootId(currentSatkerId);

        /*
         * Kalau LP berada di struktur Polda,
         * tujuan WAJIB unit/fungsi langsung
         * dalam Polda yang sama.
         */
        if (currentPolda) {
            /*
             * Target Mabes eksplisit.
             * Tidak tergantung parent/name structure.
             */
            const mabes =
                await this.dataSource.query(
                    "select 1" +
                    " from bdb_satker" +
                    " where id=$1" +
                    "   and pelimpahan_target_aktif=true" +
                    "   and dors_mapping_aktif=true" +
                    "   and coalesce(is_synthetic,false)=false" +
                    " limit 1",
                    [targetSatkerId]
                );

            if (mabes.length) {
                return true;
            }

            const targetPolda =
                await this.poldaRootId(targetSatkerId);

            if (
                !targetPolda ||
                Number(targetPolda) !==
                    Number(currentPolda)
            ) {
                return false;
            }

            const rows =
                await this.dataSource.query(
                    "select 1" +
                    " from bdb_satker s" +
                    " join bdb_satker p on p.id=s.parent_id" +

                    " where s.id=$1" +
                    "   and s.dors_mapping_aktif=true" +
                    "   and coalesce(s.is_synthetic,false)=false" +
                    "   and upper(coalesce(s.tipe_satker,''))='FUNGSI'" +
                    "   and upper(coalesce(p.tipe_satker,''))" +
                    "       in ('POLDA','POLRES','POLSEK')" +

                    "   and (" +
                    "        upper(s.deskripsi) like 'UNIT RESKRIM%'" +
                    "     or upper(s.deskripsi) like 'UNIT LANTAS%'" +
                    "     or upper(s.deskripsi) like 'SAT RESKRIM%'" +
                    "     or upper(s.deskripsi) like 'SAT NARKOBA%'" +
                    "     or upper(s.deskripsi) like 'SAT PPA%'" +
                    "     or upper(s.deskripsi) like 'DIT KRIMUM%'" +
                    "     or upper(s.deskripsi) like 'DIT KRIMSUS%'" +
                    "     or upper(s.deskripsi) like 'DIT RESKRIMSUS%'" +
                    "     or upper(s.deskripsi) like 'DIT RESKRIMUM%'" +
                    "     or upper(s.deskripsi) like 'DIT NARKOBA%'" +
                    "     or upper(s.deskripsi) like 'DIT RESNARKOBA%'" +
                    "     or upper(s.deskripsi) like 'DIT SIBER%'" +
                    "     or upper(s.deskripsi) like 'DIT RES SIBER%'" +
                    "     or upper(s.deskripsi) like 'DIT RESSIBER%'" +
                    "   )" +

                    " limit 1",

                    [targetSatkerId]
                );

            return rows.length > 0;
        }

        /*
         * Non-Polda: behavior lama.
         */
        const rows =
            await this.dataSource.query(
                'select 1 from bdb_satker cur ' +
                'where cur.id = $1 and (' +
                'cur.parent_id = $2 ' +
                'or exists (' +
                '  select 1 from bdb_satker t ' +
                '  where t.id = $2 and t.parent_id = cur.id' +
                ') ' +
                'or exists (' +
                '  select 1 from bdb_satker t ' +
                '  where t.id = $2 ' +
                '    and t.parent_id = cur.parent_id ' +
                '    and t.id != cur.id' +
                ')' +
                ')',
                [currentSatkerId, targetSatkerId]
            );

        return rows.length > 0;
    }

    async destinationUnitNama(
        targetId,
        deskripsi
    ) {
        const n =
            String(deskripsi || '')
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '');

        /*
         * Konvensi produksi yang sudah terbukti.
         */
        if (n.startsWith('UNITRESKRIM'))
            return 'RESKRIM';

        if (n.startsWith('SATRESKRIM'))
            return 'SATRESKRIM';

        if (n.startsWith('SATNARKOBA'))
            return 'SATRESNARKOBA';

        if (
            n.startsWith('DITKRIMUM') ||
            n.startsWith('DITRESKRIMUM')
        )
            return 'DITRESKRIMUM';

        if (
            n.startsWith('DITNARKOBA') ||
            n.startsWith('DITRESNARKOBA')
        )
            return 'DITRESNARKOBA';

        if (
            n.startsWith('DITSIBER') ||
            n.startsWith('DITRESSIBER')
        )
            return 'DITRESSIBER';

        /*
         * UNIT LANTAS / SAT PPA-PPO / jenis baru:
         * pakai konvensi yang sudah pernah dipakai
         * oleh target itu sendiri bila tersedia.
         */
        const common =
            await this.dataSource.query(
                "select" +
                " upper(trim(unit_nama)) as unit_nama," +
                " count(*)::int as jumlah" +
                " from bdb_laporan_polisi" +
                " where deleted_at is null" +
                "   and unit_satker_id=$1" +
                "   and nullif(trim(coalesce(unit_nama,'')),'')" +
                "       is not null" +
                " group by upper(trim(unit_nama))" +
                " order by jumlah desc" +
                " limit 1",
                [targetId]
            );

        if (
            common.length &&
            common[0].unit_nama
        ) {
            return common[0].unit_nama;
        }

        /*
         * Jangan membawa unit asal kalau konvensi
         * tujuan memang belum tersedia.
         */
        return null;
    }

    async mabesUnitNama(
        targetId,
        deskripsi
    ) {
        /*
         * Gunakan konvensi existing target tersebut.
         * Contoh:
         * DIT TIPIDUM -> DITTIPIDUM BARESKRIM POLRI
         */
        const common =
            await this.dataSource.query(
                "select" +
                " trim(unit_nama) as unit_nama," +
                " count(*)::int as jumlah" +
                " from bdb_laporan_polisi" +
                " where deleted_at is null" +
                "   and satker_id=$1" +
                "   and unit_satker_id is null" +
                "   and nullif(trim(coalesce(unit_nama,'')),'')" +
                "       is not null" +
                " group by trim(unit_nama)" +
                " order by jumlah desc" +
                " limit 1",
                [targetId]
            );

        if (
            common.length &&
            common[0].unit_nama
        ) {
            return common[0].unit_nama;
        }

        /*
         * Target baru seperti DIT POLAIR:
         * fallback ke nama master.
         */
        return deskripsi || null;
    }

    async create(opts) {
        const nomorDokumen = String(opts.nomorDokumen ?? '').trim();

        if (!nomorDokumen) {
            throw new common_1.BadRequestException(
                'Nomor dokumen pengantar pelimpahan wajib diisi.'
            );
        }

        opts.nomorDokumen = nomorDokumen;

        const tanggalDokumen = String(opts.tanggalDokumen ?? '').trim();

        if (!tanggalDokumen) {
            throw new common_1.BadRequestException(
                'Tanggal dokumen pengantar pelimpahan wajib diisi.'
            );
        }

        const keterangan = String(opts.keterangan ?? '').trim();

        if (!keterangan) {
            throw new common_1.BadRequestException(
                'Keterangan atau alasan pelimpahan wajib diisi.'
            );
        }

        opts.tanggalDokumen = tanggalDokumen;
        opts.keterangan = keterangan;

        await this.ensureTable();

        const lp =
            await this.lpRow(opts.lpId);

        if (!lp)
            throw new common_1.NotFoundException(
                'LP tidak ditemukan.'
            );

        const ownerId =
            (0, lp_scope_util_1.effectiveLpOwnerId)(
                lp
            );

        if (!ownerId)
            throw new common_1.BadRequestException(
                'LP ini belum punya satker penanganan.'
            );

        const ownerNama =
            lp.unit_satker_id
                ? lp.unit_satker_nama
                : lp.satker_nama;

        const scope =
            await (0, scope_util_1.resolveScope)(
                this.dataSource,
                opts.userId
            );

        if (
            !scope.all &&
            !(await (0, lp_scope_util_1.hasOperationalLpAccess)(
                this.dataSource,
                lp,
                scope.satkerId
            ))
        ) {
            throw new common_1.ForbiddenException(
                'LP ini bukan berada di satker Anda -- tidak bisa dilimpahkan.'
            );
        }

        if (
            Number(opts.satkerTujuanId) ===
            ownerId
        ) {
            throw new common_1.BadRequestException(
                'Satker tujuan sama dengan satker saat ini.'
            );
        }

        const allowed =
            await this.isAllowedTarget(
                ownerId,
                Number(opts.satkerTujuanId)
            );

        if (!allowed) {
            throw new common_1.BadRequestException(
                'Tujuan pelimpahan tidak valid. Pilih langsung unit/fungsi tujuan yang tersedia.'
            );
        }

        const tujuan =
            await this.dataSource.query(
                "select" +
                " s.id," +
                " s.kode," +
                " s.deskripsi," +
                " s.tipe_satker," +
                " s.parent_id," +
                " s.pelimpahan_target_aktif," +
                " p.deskripsi as parent_nama," +
                " p.tipe_satker as parent_tipe" +

                " from bdb_satker s" +
                " left join bdb_satker p" +
                "   on p.id=s.parent_id" +

                " where s.id=$1",

                [opts.satkerTujuanId]
            );

        if (!tujuan.length)
            throw new common_1.NotFoundException(
                'Satker tujuan tidak ditemukan.'
            );

        const t = tujuan[0];

        const parentType =
            String(
                t.parent_tipe || ''
            ).toUpperCase();

        /*
         * Target direct operational:
         *
         * DIT  -> parent POLDA
         * SAT  -> parent POLRES
         * UNIT -> parent POLSEK
         */
        const directOperational =
            String(
                t.tipe_satker || ''
            ).toUpperCase() === 'FUNGSI' &&
            ['POLDA', 'POLRES', 'POLSEK']
                .includes(parentType) &&
            t.parent_id &&
            t.parent_nama;

        const isMabesTarget =
            t.pelimpahan_target_aktif === true;

        /*
         * Riwayat pelimpahan menyimpan alamat
         * unit tujuan aktual, bukan parent.
         */
        const historyTargetId =
            Number(t.id);

        const historyTargetNama =
            t.deskripsi;

        let unitNama = null;
        let level = null;

        if (isMabesTarget) {
            unitNama =
                await this.mabesUnitNama(
                    t.id,
                    t.deskripsi
                );

            level = 'Mabes';
        }
        else if (directOperational) {
            unitNama =
                await this.destinationUnitNama(
                    t.id,
                    t.deskripsi
                );

            level =
                parentType === 'POLDA'
                    ? 'Polda'
                    : parentType === 'POLRES'
                        ? 'Polres'
                        : 'Polsek';
        }

        let userNama = null;

        if (opts.userId) {
            const u =
                await this.dataSource.query(
                    'select name from auth_users where id=$1',
                    [opts.userId]
                );

            userNama =
                u[0]?.name || null;
        }

        let pelimpahanId;

        const runner =
            this.dataSource.createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        try {
            const inserted =
                await runner.query(
                    'insert into bdb_lp_pelimpahan ' +
                    '(' +
                    'lp_id,' +
                    'satker_asal_id,' +
                    'satker_asal_nama,' +
                    'satker_tujuan_id,' +
                    'satker_tujuan_nama,' +
                    'keterangan,' +
                    'nomor_dokumen,' +
                    'tanggal_dokumen,' +
                    'dilimpahkan_oleh,' +
                    'dilimpahkan_oleh_nama' +
                    ') ' +
                    'values ' +
                    '($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ' +
                    'returning id',

                    [
                        opts.lpId,
                        ownerId,
                        ownerNama,
                        historyTargetId,
                        historyTargetNama,
                        opts.keterangan || null,
                        opts.nomorDokumen || null,
                        opts.tanggalDokumen || null,
                        opts.userId || null,
                        userNama
                    ]
                );

            pelimpahanId =
                inserted[0].id;

            if (isMabesTarget) {
                /*
                 * Mabes existing convention:
                 *
                 * satker_id       = unit Mabes langsung
                 * unit_satker_id  = NULL
                 * level           = Mabes
                 */
                await runner.query(
                    'update bdb_laporan_polisi ' +
                    'set ' +
                    'satker_id=$2,' +
                    'satker_nama=$3,' +
                    'unit_nama=$4,' +
                    'unit_satker_id=null,' +
                    'unit_satker_nama=null,' +
                    'unit_satker_kode=null,' +
                    'penanganan_level=$5,' +
                    'sudah_dilimpahkan=true,' +
                    'updated_at=now() ' +
                    'where id=$1',

                    [
                        opts.lpId,
                        t.id,
                        t.deskripsi,
                        unitNama,
                        level
                    ]
                );
            }
            else if (directOperational) {
                /*
                 * LP menyimpan:
                 *
                 * satker_id      = parent struktural
                 * unit_satker_id = alamat operasional
                 */
                await runner.query(
                    'update bdb_laporan_polisi ' +
                    'set ' +
                    'satker_id=$2,' +
                    'satker_nama=$3,' +
                    'unit_nama=$4,' +
                    'unit_satker_id=$5,' +
                    'unit_satker_nama=$6,' +
                    'unit_satker_kode=$7,' +
                    'penanganan_level=$8,' +
                    'sudah_dilimpahkan=true,' +
                    'updated_at=now() ' +
                    'where id=$1',

                    [
                        opts.lpId,
                        t.parent_id,
                        t.parent_nama,
                        unitNama,
                        t.id,
                        t.deskripsi,
                        t.kode,
                        level
                    ]
                );
            }
            else {
                /*
                 * Fallback non-Polda tetap behavior lama.
                 */
                await runner.query(
                    'update bdb_laporan_polisi ' +
                    'set ' +
                    'satker_id=$2,' +
                    'satker_nama=$3,' +
                    'sudah_dilimpahkan=true,' +
                    'unit_satker_id=null,' +
                    'unit_satker_nama=null,' +
                    'unit_satker_kode=null,' +
                    'updated_at=now() ' +
                    'where id=$1',

                    [
                        opts.lpId,
                        t.id,
                        t.deskripsi
                    ]
                );
            }

            await runner.commitTransaction();
        }
        catch (e) {
            await runner.rollbackTransaction();
            throw e;
        }
        finally {
            await runner.release();
        }

        this.logger.log(
            'LP ' +
            opts.lpId +
            ' (' +
            lp.no_laporan +
            ')' +
            ' dilimpahkan dari "' +
            ownerNama +
            '" ke "' +
            historyTargetNama +
            '" oleh ' +
            (
                userNama ||
                opts.userId ||
                '?'
            )
        );

        return {
            status: 1,
            data: {
                pelimpahan_id: pelimpahanId,
                lp_id: opts.lpId,
                satker_asal: ownerNama,
                satker_tujuan: historyTargetNama
            },
            message:
                'LP dilimpahkan ke "' +
                historyTargetNama +
                '". Satker asal tidak lagi punya akses aktif ke LP ini.'
        };
    }

    async createEksternal(opts) {
        await this.ensureTable();
        const lp = await this.dataSource.query('select id, satker_id, satker_nama, unit_satker_id, unit_satker_nama, no_laporan, dilimpahkan_eksternal from bdb_laporan_polisi where id=$1', [opts.lpId]);
        if (!lp.length)
            throw new common_1.NotFoundException('LP tidak ditemukan.');
        const ownerId = (0, lp_scope_util_1.effectiveLpOwnerId)(lp[0]);
        if (!ownerId)
            throw new common_1.BadRequestException('LP ini belum punya satker penanganan.');
        const ownerNama = lp[0].unit_satker_id ? lp[0].unit_satker_nama : lp[0].satker_nama;
        if (lp[0].dilimpahkan_eksternal)
            throw new common_1.BadRequestException('LP ini sudah pernah dilimpahkan ke instansi eksternal sebelumnya.');
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, opts.userId);
        if (!scope.all && !(await (0, lp_scope_util_1.hasOperationalLpAccess)(this.dataSource, lp[0], scope.satkerId))) {
            throw new common_1.ForbiddenException('LP ini bukan berada di satker Anda -- tidak bisa dilimpahkan.');
        }
        const tujuan = await this.dataSource.query('select id, nama from bdb_satker_eksternal where id=$1', [opts.satkerEksternalId]);
        if (!tujuan.length)
            throw new common_1.NotFoundException('Satker eksternal tujuan tidak ditemukan.');
        let userNama = null;
        if (opts.userId) {
            const u = await this.dataSource.query('select name from auth_users where id=$1', [opts.userId]);
            userNama = u[0]?.name || null;
        }
        let pelimpahanId;
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const inserted = await runner.query(`insert into bdb_lp_pelimpahan
                    (lp_id, satker_asal_id, satker_asal_nama, satker_eksternal_id, satker_eksternal_nama, keterangan, nomor_dokumen, tanggal_dokumen, dilimpahkan_oleh, dilimpahkan_oleh_nama)
                 values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                 returning id`, [opts.lpId, ownerId, ownerNama, tujuan[0].id, tujuan[0].nama, opts.keterangan || null, opts.nomorDokumen || null, opts.tanggalDokumen || null, opts.userId || null, userNama]);
            pelimpahanId = inserted[0].id;
            await runner.query(`update bdb_laporan_polisi
                 set sudah_dilimpahkan=true, dilimpahkan_eksternal=true, updated_at=now()
                 where id=$1`, [opts.lpId]);
            await runner.commitTransaction();
        }
        catch (e) {
            await runner.rollbackTransaction();
            throw e;
        }
        finally {
            await runner.release();
        }
        this.logger.log(`LP ${opts.lpId} (${lp[0].no_laporan}) dilimpahkan dari "${lp[0].satker_nama}" ke instansi eksternal "${tujuan[0].nama}" oleh ${userNama || opts.userId || '?'}`);
        return {
            status: 1,
            data: { pelimpahan_id: pelimpahanId, lp_id: opts.lpId, satker_asal: lp[0].satker_nama, satker_eksternal: tujuan[0].nama },
            message: `LP dilimpahkan ke instansi eksternal "${tujuan[0].nama}". Status CT/CC tidak diubah; satker Anda tidak lagi punya akses aktif ke LP ini.`,
        };
    }
    async riwayat(lpId) {
        const rows = await this.dataSource.query(`select p.id, p.satker_asal_id, p.satker_asal_nama, p.satker_tujuan_id, p.satker_tujuan_nama, p.satker_eksternal_id, p.satker_eksternal_nama,
                    p.keterangan, p.nomor_dokumen, p.tanggal_dokumen, p.dilimpahkan_oleh_nama, p.created_at,
                    (select count(*)::int from bdb_lp_pelimpahan_attachments a where a.pelimpahan_id = p.id) as jumlah_lampiran
             from bdb_lp_pelimpahan p where p.lp_id=$1 order by p.created_at asc`, [lpId]);
        return { status: 1, data: rows };
    }
    async hasArsipAccess(lpId, userId) {
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, userId);
        if (scope.all)
            return true;
        if (!scope.satkerId)
            return false;
        const rows = await this.dataSource.query(`select 1 from bdb_lp_pelimpahan where lp_id=$1 and (satker_asal_id=$2 or satker_tujuan_id=$2) limit 1`, [lpId, scope.satkerId]);
        return rows.length > 0;
    }
    async arsip(opts) {
        await this.ensureTable();
        const scope = await (0, scope_util_1.resolveScope)(this.dataSource, opts.userId);
        const page = Math.max(opts.page || 1, 1);
        const row = Math.min(Math.max(opts.row || 25, 1), 1000);
        const offset = (page - 1) * row;
        const params = [];
        const where = [`lp.sudah_dilimpahkan = true`];
        if (!scope.all) {
            if (!scope.satkerId)
                return { status: 1, data: [], total: 0, page, row };
            params.push(scope.satkerId);
            where.push(`exists (select 1 from bdb_lp_pelimpahan p where p.lp_id = lp.id and (p.satker_asal_id = $${params.length} or p.satker_tujuan_id = $${params.length}))`);
        }
        if (opts.search) {
            params.push(`%${opts.search}%`);
            where.push(`lp.no_laporan ilike $${params.length}`);
        }
        const whereSql = `where ${where.join(' and ')}`;
        const totalRes = await this.dataSource.query(`select count(*)::int as c from bdb_laporan_polisi lp ${whereSql}`, params);
        const rows = await this.dataSource.query(`select lp.id, lp.no_laporan, lp.tgl_laporan, lp.kategori, lp.dilimpahkan_eksternal, lp.satker_id as satker_saat_ini_id, lp.satker_nama as satker_saat_ini_nama,
                    (select p2.satker_asal_nama from bdb_lp_pelimpahan p2 where p2.lp_id = lp.id order by p2.created_at asc limit 1) as satker_asal_pertama,
                    (select count(*)::int from bdb_lp_pelimpahan p3 where p3.lp_id = lp.id) as jumlah_pelimpahan,
                    (select p4.created_at from bdb_lp_pelimpahan p4 where p4.lp_id = lp.id order by p4.created_at desc limit 1) as terakhir_dilimpahkan_at,
                    (select coalesce(p5.satker_tujuan_nama, p5.satker_eksternal_nama) from bdb_lp_pelimpahan p5 where p5.lp_id = lp.id order by p5.created_at desc limit 1) as tujuan_terakhir_nama
             from bdb_laporan_polisi lp
             ${whereSql}
             order by lp.updated_at desc
             limit ${row} offset ${offset}`, params);
        for (const r of rows)
            r.pid = (0, id_cipher_util_1.encodeId)(r.id);
        return { status: 1, data: rows, total: totalRes[0]?.c || 0, page, row };
    }
    async arsipDetail(lpId, userId) {
        const boleh = await this.hasArsipAccess(lpId, userId);
        if (!boleh)
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        const rows = await this.dataSource.query('select * from bdb_laporan_polisi where id=$1', [lpId]);
        const row = rows[0] || null;
        if (!row)
            return { status: 0, data: null, message: 'LP tidak ditemukan.' };
        row.pid = (0, id_cipher_util_1.encodeId)(row.id);
        const riwayat = await this.riwayat(lpId);
        return { status: 1, data: { profil: row, riwayat: riwayat.data } };
    }
    async pelimpahanLpId(pelimpahanId) {
        const rows = await this.dataSource.query('select lp_id from bdb_lp_pelimpahan where id=$1', [pelimpahanId]);
        return rows[0]?.lp_id ?? null;
    }
    async assertAttachmentAccess(pelimpahanId, userId) {
        const lpId = await this.pelimpahanLpId(pelimpahanId);
        if (lpId == null)
            throw new common_1.NotFoundException('Riwayat pelimpahan tidak ditemukan.');
        const boleh = await this.hasArsipAccess(lpId, userId);
        if (!boleh)
            throw new common_1.ForbiddenException('Anda tidak berhak mengakses lampiran pelimpahan ini.');
        return lpId;
    }
    async addAttachments(pelimpahanId, userId, files) {
        await this.ensureTable();
        await this.assertAttachmentAccess(pelimpahanId, userId);
        for (const f of files || []) {
            const key = await this.minio.upload(f, 'lp-pelimpahan');
            await this.dataSource.query(`insert into bdb_lp_pelimpahan_attachments (pelimpahan_id, file_name, object_key, content_type, size) values ($1,$2,$3,$4,$5)`, [pelimpahanId, f.originalname, key, f.mimetype || null, f.size || null]);
        }
        return this.listAttachments(pelimpahanId, userId);
    }
    async listAttachments(pelimpahanId, userId) {
        await this.assertAttachmentAccess(pelimpahanId, userId);
        const rows = await this.dataSource.query(`select id, file_name, object_key, content_type, size, created_at from bdb_lp_pelimpahan_attachments where pelimpahan_id = $1 order by id desc`, [pelimpahanId]);
        const data = [];
        for (const r of rows) {
            let url = null;
            try {
                url = await this.minio.presignedUrl(r.object_key, 3600);
            }
            catch {
                url = null;
            }
            data.push({ id: r.id, file_name: r.file_name, content_type: r.content_type, size: r.size, created_at: r.created_at, url });
        }
        return { status: 1, data };
    }
    async removeAttachment(attId, userId) {
        const rows = await this.dataSource.query('select pelimpahan_id, object_key from bdb_lp_pelimpahan_attachments where id = $1', [attId]);
        if (!rows.length)
            throw new common_1.NotFoundException('Lampiran tidak ditemukan.');
        await this.assertAttachmentAccess(Number(rows[0].pelimpahan_id), userId);
        try {
            await this.minio.remove(rows[0].object_key);
        }
        catch {
        }
        await this.dataSource.query('delete from bdb_lp_pelimpahan_attachments where id = $1', [attId]);
        return { status: 1, message: 'Lampiran dihapus.' };
    }
};
exports.LpPelimpahanService = LpPelimpahanService;
exports.LpPelimpahanService = LpPelimpahanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        minio_service_1.MinioService])
], LpPelimpahanService);
//# sourceMappingURL=lp-pelimpahan.service.js.map
