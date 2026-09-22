import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class BdbMasterService {
    constructor(private readonly dataSource: DataSource) {}

    private getPaging(query: Record<string, any>) {
        const page = Math.max(parseInt(String(query.page || '1'), 10) || 1, 1);
        const limitRaw = parseInt(String(query.limit || '50'), 10) || 50;
        const limit = Math.min(Math.max(limitRaw, 1), 200);
        const offset = (page - 1) * limit;
        const search = String(query.search || '').trim();

        return { page, limit, offset, search };
    }

    private cleanText(value: any) {
        if (value === undefined || value === null) return null;
        const text = String(value).trim();
        return text === '' ? null : text;
    }

    private cleanNumber(value: any) {
        if (value === undefined || value === null || String(value).trim() === '') return null;
        const parsed = Number(String(value).replace(',', '.'));
        return Number.isFinite(parsed) ? parsed : null;
    }

    private async ensureSatkerProfileTable() {
        await this.dataSource.query(`
            create table if not exists bdb_satker_profiles (
                id bigserial primary key,
                satker_master_id bigint null references bdb_satker_master(id) on delete set null,
                satker_key text not null unique,
                alamat text,
                provinsi text,
                kabupaten_kota text,
                kecamatan text,
                latitude numeric(12,8),
                longitude numeric(12,8),
                jumlah_penduduk bigint,
                luas_wilayah numeric(14,2),
                telepon text,
                email text,
                website text,
                keterangan text,
                payload_json jsonb,
                created_at timestamp not null default now(),
                updated_at timestamp not null default now()
            )
        `);

        await this.dataSource.query(`
            create index if not exists idx_bdb_satker_profiles_satker_master_id
            on bdb_satker_profiles (satker_master_id)
        `);
    }

    async getSatkerProfile(query: Record<string, any>) {
        await this.ensureSatkerProfileTable();

        const scope = String(query.scope || query.mode || '').toLowerCase();

        if (scope === 'nasional' || scope === 'national') {
            const rows = await this.dataSource.query(`
                select
                    null::bigint as satker_master_id,
                    'NASIONAL' as satker_key,
                    'Nasional' as nama_satker_canonical,
                    'Nasional' as level,
                    'Seluruh Data DORS' as domain,
                    'Semua Satker' as sub_domain,
                    '-' as parent_key,
                    '-' as nama_parent_satker_dors,
                    'Nasional' as full_path,
                    'NASIONAL' as operational_role,
                    null::text as alamat,
                    null::text as provinsi,
                    null::text as kabupaten_kota,
                    null::text as kecamatan,
                    null::numeric as latitude,
                    null::numeric as longitude,
                    coalesce(sum(coalesce(p.jumlah_penduduk, 0)), 0)::bigint as jumlah_penduduk,
                    coalesce(sum(coalesce(p.luas_wilayah, 0)), 0)::numeric as luas_wilayah,
                    null::text as telepon,
                    null::text as email,
                    null::text as website,
                    concat(
                        'Akumulasi dari ',
                        count(*)::text,
                        ' Polda. Terisi penduduk: ',
                        count(*) filter (where coalesce(p.jumlah_penduduk, 0) > 0)::text,
                        ' Polda.'
                    ) as keterangan
                from bdb_satker_master s
                left join bdb_satker_profiles p on p.satker_key = s.satker_key
                where lower(coalesce(s.level, '')) = 'polda'
                  and coalesce(s.domain, '') = 'INTERNAL POLRI'
                  and coalesce(s.status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')
            `);

            return { data: rows[0] || null };
        }

        const satkerKey = this.cleanText(query.satker_key || query.satkerKey);
        const satkerId = Number.parseInt(String(query.satker_id || query.satkerId || ''), 10);
        const params: any[] = [];
        const whereParts = [`coalesce(s.status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')`];

        if (satkerKey) {
            params.push(satkerKey);
            whereParts.push(`s.satker_key = $${params.length}`);
        } else if (Number.isInteger(satkerId) && satkerId > 0) {
            params.push(satkerId);
            whereParts.push(`s.id = $${params.length}`);
        } else {
            params.push('%BINOPS%');
            whereParts.push(`(s.nama_satker_canonical ilike $${params.length} or coalesce(s.operational_role, '') ilike $${params.length})`);
        }

        const rows = await this.dataSource.query(
            `
            select
                s.id as satker_master_id,
                s.satker_key,
                s.nama_satker_canonical,
                s.level,
                s.domain,
                s.sub_domain,
                s.parent_key,
                s.nama_parent_satker_dors,
                s.full_path,
                s.operational_role,
                p.alamat,
                p.provinsi,
                p.kabupaten_kota,
                p.kecamatan,
                p.latitude,
                p.longitude,
                p.jumlah_penduduk,
                p.luas_wilayah,
                p.telepon,
                p.email,
                p.website,
                p.keterangan
            from bdb_satker_master s
            left join bdb_satker_profiles p on p.satker_key = s.satker_key
            where ${whereParts.join(' and ')}
            order by
                case when upper(coalesce(s.operational_role, '')) like '%BINOPS%' then 0 else 1 end,
                s.nama_satker_canonical asc
            limit 1
            `,
            params
        );

        return { data: rows[0] || null };
    }

    async updateSatkerProfile(body: Record<string, any>) {
        await this.ensureSatkerProfileTable();

        const satkerKey = this.cleanText(body.satker_key || body.satkerKey);

        if (!satkerKey) {
            throw new BadRequestException('Satker wajib dipilih');
        }

        const satkerRows = await this.dataSource.query(
            `
            select id, satker_key
            from bdb_satker_master
            where satker_key = $1
              and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')
            limit 1
            `,
            [satkerKey]
        );

        const satker = satkerRows[0];

        if (!satker) {
            throw new NotFoundException('Satker tidak ditemukan');
        }

        await this.dataSource.query(
            `
            insert into bdb_satker_profiles (
                satker_master_id,
                satker_key,
                alamat,
                provinsi,
                kabupaten_kota,
                kecamatan,
                latitude,
                longitude,
                jumlah_penduduk,
                luas_wilayah,
                telepon,
                email,
                website,
                keterangan,
                payload_json,
                created_at,
                updated_at
            )
            values (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15::jsonb, now(), now()
            )
            on conflict (satker_key) do update
            set
                satker_master_id = excluded.satker_master_id,
                alamat = excluded.alamat,
                provinsi = excluded.provinsi,
                kabupaten_kota = excluded.kabupaten_kota,
                kecamatan = excluded.kecamatan,
                latitude = excluded.latitude,
                longitude = excluded.longitude,
                jumlah_penduduk = excluded.jumlah_penduduk,
                luas_wilayah = excluded.luas_wilayah,
                telepon = excluded.telepon,
                email = excluded.email,
                website = excluded.website,
                keterangan = excluded.keterangan,
                payload_json = coalesce(bdb_satker_profiles.payload_json, '{}'::jsonb) || excluded.payload_json,
                updated_at = now()
            `,
            [
                satker.id,
                satkerKey,
                this.cleanText(body.alamat),
                this.cleanText(body.provinsi),
                this.cleanText(body.kabupaten_kota || body.kabupatenKota),
                this.cleanText(body.kecamatan),
                this.cleanNumber(body.latitude),
                this.cleanNumber(body.longitude),
                this.cleanNumber(body.jumlah_penduduk || body.jumlahPenduduk),
                this.cleanNumber(body.luas_wilayah || body.luasWilayah),
                this.cleanText(body.telepon),
                this.cleanText(body.email),
                this.cleanText(body.website),
                this.cleanText(body.keterangan),
                JSON.stringify({
                    updated_by: 'BDB_CMS_SETTING',
                    updated_at: new Date().toISOString()
                })
            ]
        );

        return this.getSatkerProfile({ satkerKey });
    }

    async getSatker(query: Record<string, any>) {
        const { page, limit, offset, search } = this.getPaging(query);
        const params: any[] = [];
        const whereParts: string[] = [];

        const addParam = (value: any) => {
            params.push(value);
            return `$${params.length}`;
        };

        if (search) {
            const idx = addParam(`%${search}%`);
            whereParts.push(`(
                nama_satker_canonical ilike ${idx}
                or nama_satker_dors ilike ${idx}
                or dors_kode ilike ${idx}
                or coalesce(manual_code, '') ilike ${idx}
                or coalesce(satker_key, '') ilike ${idx}
                or level ilike ${idx}
                or domain ilike ${idx}
                or sub_domain ilike ${idx}
                or coalesce(operational_role, '') ilike ${idx}
                or coalesce(source_type, '') ilike ${idx}
            )`);
        }

        if (query.domain) {
            whereParts.push(`domain = ${addParam(String(query.domain))}`);
        }

        if (query.subDomain || query.sub_domain) {
            whereParts.push(`sub_domain = ${addParam(String(query.subDomain || query.sub_domain))}`);
        }

        if (query.levels) {
            const levels = String(query.levels)
                .split(',')
                .map((level) => level.trim())
                .filter(Boolean);

            if (levels.length > 0) {
                const levelParams = levels.map((level) => addParam(level)).join(', ');
                whereParts.push(`level in (${levelParams})`);
            }
        } else if (query.level) {
            whereParts.push(`level = ${addParam(String(query.level))}`);
        }

        if (query.sourceType || query.source_type) {
            whereParts.push(`source_type = ${addParam(String(query.sourceType || query.source_type))}`);
        }
 
        if (query.kodePrefix || query.kode_prefix) {
            const kodePrefix = String(query.kodePrefix || query.kode_prefix).trim();

            if (kodePrefix) {
                const prefixParam = addParam(`${kodePrefix}%`);
                const containsParam = addParam(`%${kodePrefix}%`);

                whereParts.push(`(
                    coalesce(dors_kode, '') like ${prefixParam}
                    or coalesce(manual_code, '') like ${prefixParam}
                    or coalesce(satker_key, '') ilike ${containsParam}
                    or coalesce(parent_key, '') ilike ${containsParam}
                    or coalesce(grandparent_key, '') ilike ${containsParam}
                )`);
            }
        }

        if (query.operationalRoles || query.operational_roles) {
            const roles = String(query.operationalRoles || query.operational_roles)
                .split(',')
                .map((role) => role.trim().toUpperCase())
                .filter(Boolean);

            if (roles.length > 0) {
                const roleParams = roles.map((role) => addParam(role)).join(', ');
                whereParts.push("upper(coalesce(operational_role, '')) in (" + roleParams + ")");
            }
        } else if (query.operationalRole || query.operational_role) {
            const role = String(query.operationalRole || query.operational_role).toUpperCase();

            if (role === 'OPSNAL') {
                whereParts.push(`(
                    source_type = 'BDB'
                    or upper(coalesce(operational_role, '')) in (
                        'SPKT',
                        'BINOPS',
                        'URBINOPS',
                        'BAGBINOPS',
                        'SUBBAGBINOPS',
                        'ROBINOPS',
                        'UNIT_PENANGANAN',
                        'SUBNIT'
                    )
                )`);
            } else {
                whereParts.push(`upper(coalesce(operational_role, '')) = ${addParam(role)}`);
            }
        }

        if (query.status) {
            whereParts.push(`status = ${addParam(String(query.status))}`);
        } else {
            whereParts.push(`coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')`);
        }

        const where = whereParts.length ? `where ${whereParts.join(' and ')}` : '';

        const countRows = await this.dataSource.query(
            `select count(*)::int as total from bdb_satker_master ${where}`,
            params
        );

        const sortBy = String(query.sortBy || 'kode').trim();
        const sortDir = String(query.sortDir || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';

        const kodeExpr = "coalesce(nullif(dors_kode, ''), nullif(replace(manual_code, '.BDB-', '-'), ''), satker_key)";
        const kodeNumericPrefixExpr = `substring(${kodeExpr} from '^[0-9][0-9.-]*[0-9]')`;
        const kodeNumericNormalizedExpr = `replace(${kodeNumericPrefixExpr}, '-', '.')`;
        const kodeDepthExpr = `cardinality(string_to_array(${kodeNumericNormalizedExpr}, '.'))`;
        const kodeArrayExpr = `string_to_array(${kodeNumericNormalizedExpr}, '.')::int[]`;
        const kodeNumericCheck = `${kodeNumericPrefixExpr} is not null and ${kodeNumericNormalizedExpr} ~ '^[0-9]+([.][0-9]+)*$'`;
        const mainSatkerSortExpr = `
            case
                when ${kodeNumericCheck} and ${kodeExpr} = ${kodeNumericPrefixExpr} then 0
                when upper(coalesce(operational_role, '')) in ('BARESKRIM', 'BAHARKAM') then 0
                else 1
            end
        `;
        const operationalSortExpr = `
            case
                when upper(coalesce(operational_role, '')) in ('BARESKRIM', 'BAHARKAM') then 0
                when upper(coalesce(operational_role, '')) = 'SPK_BARESKRIM' then 1
                when upper(coalesce(operational_role, '')) = 'ROBINOPS' then 2
                when upper(coalesce(operational_role, '')) in (
                    'BINOPS',
                    'URBINOPS',
                    'BAGBINOPS',
                    'BAGBINOPS_DITRES',
                    'SUBBAGBINOPS',
                    'SUBBAGBINOPS_DITTIPID'
                ) then 3
                else 9
            end
        `;

        let orderBy = `
            order by
                case when ${kodeNumericCheck} then 0 else 1 end ${sortDir},
                case when ${kodeNumericCheck} then ${kodeArrayExpr} else array[999999] end ${sortDir},
                case when ${kodeNumericCheck} then ${kodeDepthExpr} else 99 end ${sortDir},
                ${mainSatkerSortExpr} asc,
                ${operationalSortExpr} asc,
                case when coalesce(is_holding_node, false) = true then 0 else 1 end asc,
                ${kodeExpr} ${sortDir},
                id ${sortDir}
        `;

        const sortColumnMap: Record<string, string> = {
            nama: 'lower(nama_satker_canonical)',
            domain: 'domain',
            sub_domain: 'sub_domain',
            level: 'level',
            status: 'status'
        };

        if (sortBy !== 'kode' && sortColumnMap[sortBy]) {
            orderBy = `order by ${sortColumnMap[sortBy]} ${sortDir}, ${kodeExpr} asc, id asc`;
        }

        const dataParams = [...params, limit, offset];

        const rows = await this.dataSource.query(
            `
            select
                id,
                domain,
                sub_domain,
                level,
                nama_satker_canonical,
                dors_satker_id,
                dors_kode,
                manual_code,
                case
                    when dors_kode is not null and trim(dors_kode) <> '' then dors_kode
                    when manual_code is not null and trim(manual_code) <> '' then replace(manual_code, '.BDB-', '-')
                    else satker_key
                end as kode_tampil,
                satker_key,
                parent_key,
                grandparent_key,
                full_path,
                nama_satker_dors,
                case
                    when level = 'Polda' and coalesce(nama_parent_satker_dors, '') = nama_satker_canonical then '-'
                    when coalesce(nama_parent_satker_dors, '') = '' then '-'
                    else nama_parent_satker_dors
                end as nama_parent_satker_dors,
                case
                    when coalesce(nama_grandparent_satker_dors, '') = '' then '-'
                    else nama_grandparent_satker_dors
                end as nama_grandparent_satker_dors,
                source_type,
                operational_role,
                is_holding_node,
                status
            from bdb_satker_master
            ${where}
            ${orderBy}
            limit $${dataParams.length - 1}
            offset $${dataParams.length}
            `,
            dataParams
        );

        return {
            data: rows,
            meta: { page, limit, total: countRows[0]?.total || 0 }
        };
    }

    async upsertDorsSatker(body: Record<string, any>) {
        const cleanText = (value: any) => {
            if (value === undefined || value === null) return null;
            const text = String(value).trim();
            return text === '' ? null : text;
        };

        const upperText = (value: any) => {
            const text = cleanText(value);
            return text ? text.toUpperCase() : null;
        };

        const dorsKode = cleanText(body.dors_kode || body.dorsKode || body.kode || body.kode_satker);
        const namaSatker = cleanText(
            body.nama_satker_canonical ||
            body.namaSatkerCanonical ||
            body.nama_satker_dors ||
            body.namaSatkerDors ||
            body.nama_satker ||
            body.nama
        );

        if (!dorsKode) {
            throw new BadRequestException('dors_kode wajib diisi');
        }

        if (!namaSatker) {
            throw new BadRequestException('nama_satker wajib diisi');
        }

        const level = cleanText(body.level) || 'Unit';
        const domain = cleanText(body.domain) || 'INTERNAL POLRI';
        const subDomain = cleanText(body.sub_domain || body.subDomain) || 'INTERNAL RESERSE';
        const status = cleanText(body.status) || 'Aktif';

        const inferOperationalRole = () => {
            const explicit = upperText(body.operational_role || body.operationalRole);
            if (explicit) return explicit;

            const nama = namaSatker.toUpperCase();

            if (nama.includes('DITTIPID')) return 'DITTIPID';
            if (nama.includes('DITRES')) return 'DITRES';
            if (nama.includes('SATRES') || nama.includes('SAT RES')) return 'SATRES';
            if (nama.includes('UNIT RESKRIM') || nama.includes('UNITRES')) return 'UNITRES';
            if (nama.includes('DITLANTAS')) return 'DITLANTAS';
            if (nama.includes('SATLANTAS')) return 'SATLANTAS';
            if (nama.includes('DITPOLAIR')) return 'DITPOLAIR';
            if (nama.includes('SATPOLAIR')) return 'SATPOLAIR';
            if (nama.includes('SATSAMAPTA')) return 'SATSAMAPTA';
            if (nama.includes('DENSUS 88')) return 'DENSUS88';
            if (nama.includes('KORTASTIPIDKOR')) return 'KORTASTIPIDKOR';
            if (nama.includes('KORPOLAIR')) return 'KORPOLAIR';

            return null;
        };

        const operationalRole = inferOperationalRole();

        let parentKey = cleanText(body.parent_key || body.parentKey);
        let grandparentKey = cleanText(body.grandparent_key || body.grandparentKey);

        let parentName = cleanText(body.nama_parent_satker_dors || body.namaParentSatkerDors);
        let grandparentName = cleanText(body.nama_grandparent_satker_dors || body.namaGrandparentSatkerDors);

        const parentDorsKode = cleanText(body.parent_dors_kode || body.parentDorsKode);
        const grandparentDorsKode = cleanText(body.grandparent_dors_kode || body.grandparentDorsKode);

        if (!parentKey && parentDorsKode) {
            const parentRows = await this.dataSource.query(
                `
                select satker_key, nama_satker_canonical, nama_parent_satker_dors
                from bdb_satker_master
                where dors_kode = $1
                  and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')
                order by case when source_type = 'DORS' then 0 else 1 end, id asc
                limit 1
                `,
                [parentDorsKode]
            );

            const parent = parentRows[0];

            if (parent) {
                parentKey = parent.satker_key;
                parentName = parentName || parent.nama_satker_canonical;
                grandparentName = grandparentName || parent.nama_parent_satker_dors;
            }
        }

        if (!grandparentKey && grandparentDorsKode) {
            const grandparentRows = await this.dataSource.query(
                `
                select satker_key, nama_satker_canonical
                from bdb_satker_master
                where dors_kode = $1
                  and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')
                order by case when source_type = 'DORS' then 0 else 1 end, id asc
                limit 1
                `,
                [grandparentDorsKode]
            );

            const grandparent = grandparentRows[0];

            if (grandparent) {
                grandparentKey = grandparent.satker_key;
                grandparentName = grandparentName || grandparent.nama_satker_canonical;
            }
        }

        if (parentKey && !parentName) {
            const parentRows = await this.dataSource.query(
                `
                select nama_satker_canonical, nama_parent_satker_dors
                from bdb_satker_master
                where satker_key = $1
                limit 1
                `,
                [parentKey]
            );

            const parent = parentRows[0];

            if (parent) {
                parentName = parent.nama_satker_canonical;
                grandparentName = grandparentName || parent.nama_parent_satker_dors;
            }
        }

        const satkerKey = cleanText(body.satker_key || body.satkerKey) || `${subDomain}:${level}:${dorsKode}`;
        const fullPath = cleanText(body.full_path || body.fullPath) || [parentName, namaSatker].filter(Boolean).join(' > ') || namaSatker;

        const payloadJson = {
            ...(body.payload_json || body.payloadJson || {}),
            received_by: 'BDB_DORS_UPSERT',
            received_at: new Date().toISOString()
        };

        const existingRows = await this.dataSource.query(
            `
            select id
            from bdb_satker_master
            where (source_type = 'DORS' and dors_kode = $1)
               or satker_key = $2
            order by case when source_type = 'DORS' then 0 else 1 end, id asc
            limit 1
            `,
            [dorsKode, satkerKey]
        );

        const existing = existingRows[0];

        let row;

        if (existing) {
            // UPDATE ... RETURNING via DataSource.query() balikin tuple [rows[], affectedCount].
            const [rows] = await this.dataSource.query(
                `
                update bdb_satker_master
                set
                    domain = $2,
                    sub_domain = $3,
                    level = $4,
                    nama_satker_canonical = $5,
                    nama_satker_dors = $6,
                    nama_parent_satker_dors = $7,
                    nama_grandparent_satker_dors = $8,
                    status = $9,
                    payload_json = coalesce(payload_json, '{}'::jsonb) || $10::jsonb,
                    updated_at = now(),
                    satker_key = $11,
                    parent_key = $12,
                    grandparent_key = $13,
                    full_path = $14,
                    source_type = 'DORS',
                    manual_code = null,
                    operational_role = $15
                where id = $1
                returning *
                `,
                [
                    existing.id,
                    domain,
                    subDomain,
                    level,
                    namaSatker,
                    cleanText(body.nama_satker_dors || body.namaSatkerDors) || namaSatker,
                    parentName,
                    grandparentName,
                    status,
                    JSON.stringify(payloadJson),
                    satkerKey,
                    parentKey,
                    grandparentKey,
                    fullPath,
                    operationalRole
                ]
            );

            row = rows[0];
        } else {
            const rows = await this.dataSource.query(
                `
                insert into bdb_satker_master (
                    domain,
                    sub_domain,
                    level,
                    nama_satker_canonical,
                    dors_satker_id,
                    dors_kode,
                    nama_satker_dors,
                    nama_parent_satker_dors,
                    nama_grandparent_satker_dors,
                    status,
                    payload_json,
                    created_at,
                    updated_at,
                    satker_key,
                    parent_key,
                    grandparent_key,
                    full_path,
                    source_type,
                    manual_code,
                    operational_role,
                    is_holding_node
                )
                values (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                    $11::jsonb, now(), now(), $12, $13, $14, $15,
                    'DORS', null, $16, false
                )
                returning *
                `,
                [
                    domain,
                    subDomain,
                    level,
                    namaSatker,
                    cleanText(body.dors_satker_id || body.dorsSatkerId),
                    dorsKode,
                    cleanText(body.nama_satker_dors || body.namaSatkerDors) || namaSatker,
                    parentName,
                    grandparentName,
                    status,
                    JSON.stringify(payloadJson),
                    satkerKey,
                    parentKey,
                    grandparentKey,
                    fullPath,
                    operationalRole
                ]
            );

            row = rows[0];
        }

        const childRows = await this.dataSource.query(
            `
            select count(*)::int as total
            from bdb_satker_master
            where satker_key like $1
            `,
            [`BDB:${dorsKode}%`]
        );

        return {
            data: row,
            meta: {
                mode: existing ? 'updated' : 'inserted',
                generated_children: childRows[0]?.total || 0
            }
        };
    }

    async createManualSatker(body: Record<string, any>) {
        const cleanText = (value: any) => {
            if (value === undefined || value === null) return null;
            const text = String(value).trim();
            return text === '' ? null : text;
        };

        const upperText = (value: any) => {
            const text = cleanText(value);
            return text ? text.toUpperCase() : null;
        };

        const namaSatker = cleanText(
            body.nama_satker_canonical ||
            body.namaSatkerCanonical ||
            body.nama_satker ||
            body.namaSatker ||
            body.nama
        );
        const manualCodeRaw = cleanText(body.manual_code || body.manualCode || body.kode_tampil || body.kode || body.id_satker);

        if (!namaSatker) {
            throw new BadRequestException('Nama satker wajib diisi');
        }

        if (!manualCodeRaw) {
            throw new BadRequestException('ID satker manual wajib diisi');
        }

        const manualCode = manualCodeRaw.toUpperCase().replace(/\s+/g, '-');
        const satkerKey = cleanText(body.satker_key || body.satkerKey) || `BDB:${manualCode}`;
        const domain = upperText(body.domain) || 'EKSTERNAL POLRI';
        const subDomain = upperText(body.sub_domain || body.subDomain) || 'EKSTERNAL NON POLRI';
        const level = cleanText(body.level) || 'Eksternal';
        const status = cleanText(body.status) || 'Aktif';
        const operationalRole = upperText(body.operational_role || body.operationalRole) || 'EKSTERNAL';
        const isHoldingNode = body.is_holding_node === true ||
            body.isHoldingNode === true ||
            String(body.is_holding_node || body.isHoldingNode || '').toLowerCase() === 'true';

        let parentKey = cleanText(body.parent_key || body.parentKey);
        let grandparentKey = cleanText(body.grandparent_key || body.grandparentKey);
        let parentName = cleanText(body.nama_parent_satker_dors || body.namaParentSatkerDors);
        let grandparentName = cleanText(body.nama_grandparent_satker_dors || body.namaGrandparentSatkerDors);

        if (parentKey) {
            const parentRows = await this.dataSource.query(
                `
                select satker_key, parent_key, nama_satker_canonical, nama_parent_satker_dors
                from bdb_satker_master
                where satker_key = $1
                  and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST')
                limit 1
                `,
                [parentKey]
            );

            const parent = parentRows[0];

            if (!parent) {
                throw new BadRequestException('Parent satker tidak ditemukan');
            }

            parentName = parentName || parent.nama_satker_canonical;
            grandparentKey = grandparentKey || parent.parent_key;
            grandparentName = grandparentName || parent.nama_parent_satker_dors;
        }

        if (grandparentKey && !grandparentName) {
            const grandparentRows = await this.dataSource.query(
                `
                select nama_satker_canonical
                from bdb_satker_master
                where satker_key = $1
                  and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST')
                limit 1
                `,
                [grandparentKey]
            );

            grandparentName = grandparentRows[0]?.nama_satker_canonical || null;
        }

        const duplicateRows = await this.dataSource.query(
            `
            select id, nama_satker_canonical
            from bdb_satker_master
            where satker_key = $1
               or manual_code = $2
            limit 1
            `,
            [satkerKey, manualCode]
        );

        if (duplicateRows[0]) {
            throw new BadRequestException(`ID satker sudah dipakai: ${duplicateRows[0].nama_satker_canonical}`);
        }

        const fullPath = [grandparentName, parentName, namaSatker].filter(Boolean).join(' > ') || namaSatker;
        const payloadJson = {
            ...(body.payload_json || body.payloadJson || {}),
            created_by: 'BDB_CMS_MANUAL',
            created_at: new Date().toISOString()
        };

        const rows = await this.dataSource.query(
            `
            insert into bdb_satker_master (
                domain,
                sub_domain,
                level,
                nama_satker_canonical,
                dors_satker_id,
                dors_kode,
                nama_satker_dors,
                nama_parent_satker_dors,
                nama_grandparent_satker_dors,
                status,
                payload_json,
                created_at,
                updated_at,
                satker_key,
                parent_key,
                grandparent_key,
                full_path,
                source_type,
                manual_code,
                operational_role,
                is_holding_node
            )
            values (
                $1, $2, $3, $4, null, null, $4, $5, $6, $7,
                $8::jsonb, now(), now(), $9, $10, $11, $12,
                'BDB', $13, $14, $15
            )
            returning
                id,
                domain,
                sub_domain,
                level,
                nama_satker_canonical,
                dors_satker_id,
                dors_kode,
                manual_code,
                case
                    when dors_kode is not null and trim(dors_kode) <> '' then dors_kode
                    when manual_code is not null and trim(manual_code) <> '' then replace(manual_code, '.BDB-', '-')
                    else satker_key
                end as kode_tampil,
                satker_key,
                parent_key,
                grandparent_key,
                full_path,
                nama_satker_dors,
                case
                    when coalesce(nama_parent_satker_dors, '') = '' then '-'
                    else nama_parent_satker_dors
                end as nama_parent_satker_dors,
                case
                    when coalesce(nama_grandparent_satker_dors, '') = '' then '-'
                    else nama_grandparent_satker_dors
                end as nama_grandparent_satker_dors,
                source_type,
                operational_role,
                is_holding_node,
                status
            `,
            [
                domain,
                subDomain,
                level,
                namaSatker,
                parentName,
                grandparentName,
                status,
                JSON.stringify(payloadJson),
                satkerKey,
                parentKey,
                grandparentKey,
                fullPath,
                manualCode,
                operationalRole,
                isHoldingNode
            ]
        );

        return { data: rows[0] };
    }

    async updateSatker(idRaw: string, body: Record<string, any>) {
        const id = Number.parseInt(String(idRaw || ''), 10);

        if (!Number.isInteger(id) || id <= 0) {
            throw new BadRequestException('ID satker tidak valid');
        }

        const existingRows = await this.dataSource.query(
            `
            select *
            from bdb_satker_master
            where id = $1
              and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST')
            limit 1
            `,
            [id]
        );

        const existing = existingRows[0];

        if (!existing) {
            throw new NotFoundException('Satker tidak ditemukan');
        }

        const hasField = (key: string) => Object.prototype.hasOwnProperty.call(body || {}, key);
        const cleanText = (value: any) => {
            if (value === undefined || value === null) return null;
            const text = String(value).trim();
            return text === '' ? null : text;
        };

        const allowedColumns: Record<string, string> = {
            nama_satker_canonical: 'nama_satker_canonical',
            domain: 'domain',
            sub_domain: 'sub_domain',
            level: 'level',
            status: 'status',
            operational_role: 'operational_role'
        };

        const values: any[] = [];
        const updates: string[] = [];

        for (const [inputKey, columnName] of Object.entries(allowedColumns)) {
            if (!hasField(inputKey)) continue;

            const value = cleanText(body[inputKey]);

            if (inputKey === 'nama_satker_canonical' && !value) {
                throw new BadRequestException('Nama satker wajib diisi');
            }

            values.push(value);
            updates.push(`${columnName} = $${values.length}`);
        }

        if (hasField('parent_key')) {
            const parentKey = cleanText(body.parent_key);

            if (parentKey) {
                const parentRows = await this.dataSource.query(
                    `
                    select satker_key, nama_satker_canonical
                    from bdb_satker_master
                    where satker_key = $1
                      and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST')
                    limit 1
                    `,
                    [parentKey]
                );

                if (!parentRows[0]) {
                    throw new BadRequestException('Parent key tidak ditemukan');
                }

                values.push(parentKey);
                updates.push(`parent_key = $${values.length}`);

                values.push(parentRows[0].nama_satker_canonical);
                updates.push(`nama_parent_satker_dors = $${values.length}`);
            } else {
                updates.push(`parent_key = null`);
                updates.push(`nama_parent_satker_dors = null`);
            }
        }

        if (hasField('grandparent_key')) {
            const grandparentKey = cleanText(body.grandparent_key);

            if (grandparentKey) {
                const grandparentRows = await this.dataSource.query(
                    `
                    select satker_key, nama_satker_canonical
                    from bdb_satker_master
                    where satker_key = $1
                      and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST')
                    limit 1
                    `,
                    [grandparentKey]
                );

                if (!grandparentRows[0]) {
                    throw new BadRequestException('Grandparent key tidak ditemukan');
                }

                values.push(grandparentKey);
                updates.push(`grandparent_key = $${values.length}`);

                values.push(grandparentRows[0].nama_satker_canonical);
                updates.push(`nama_grandparent_satker_dors = $${values.length}`);
            } else {
                updates.push(`grandparent_key = null`);
                updates.push(`nama_grandparent_satker_dors = null`);
            }
        }

        if (updates.length === 0) {
            throw new BadRequestException('Tidak ada field yang diubah');
        }

        values.push(id);

        // UPDATE ... RETURNING via DataSource.query() balikin tuple [rows[], affectedCount].
        const [rows] = await this.dataSource.query(
            `
            update bdb_satker_master
            set
                ${updates.join(',\n                ')},
                payload_json = coalesce(payload_json, '{}'::jsonb) || jsonb_build_object(
                    'canonical_updated_by', 'BDB_CMS',
                    'canonical_updated_at', now()
                ),
                updated_at = now()
            where id = $${values.length}
            returning
                id,
                domain,
                sub_domain,
                level,
                nama_satker_canonical,
                dors_satker_id,
                dors_kode,
                manual_code,
                case
                    when dors_kode is not null and trim(dors_kode) <> '' then dors_kode
                    when manual_code is not null and trim(manual_code) <> '' then replace(manual_code, '.BDB-', '-')
                    else satker_key
                end as kode_tampil,
                satker_key,
                parent_key,
                grandparent_key,
                full_path,
                nama_satker_dors,
                case
                    when level = 'Polda' and coalesce(nama_parent_satker_dors, '') = nama_satker_canonical then '-'
                    when coalesce(nama_parent_satker_dors, '') = '' then '-'
                    else nama_parent_satker_dors
                end as nama_parent_satker_dors,
                case
                    when coalesce(nama_grandparent_satker_dors, '') = '' then '-'
                    else nama_grandparent_satker_dors
                end as nama_grandparent_satker_dors,
                source_type,
                operational_role,
                is_holding_node,
                status
            `,
            values
        );

        return { data: rows[0] };
    }
    async getKejahatan(query: Record<string, any>) {
        const { page, limit, offset, search } = this.getPaging(query);
        const params: any[] = [];
        const whereParts: string[] = [];

        const addParam = (value: any) => {
            params.push(value);
            return `$${params.length}`;
        };

        if (search) {
            const idx = addParam(`%${search}%`);
            whereParts.push(`(
                kategori ilike ${idx}
                or jenis_kejahatan ilike ${idx}
                or nama_kejahatan_canonical ilike ${idx}
                or nama_kejahatan_dors ilike ${idx}
                or coalesce(dors_crime_id::text, '') ilike ${idx}
                or coalesce(pasal, '') ilike ${idx}
            )`);
        }

        if (query.kategori) {
            whereParts.push(`kategori = ${addParam(String(query.kategori))}`);
        }

        if (query.jenisKejahatan || query.jenis_kejahatan) {
            whereParts.push(`jenis_kejahatan = ${addParam(String(query.jenisKejahatan || query.jenis_kejahatan))}`);
        }

        if (query.status) {
            whereParts.push(`upper(coalesce(status, '')) = ${addParam(String(query.status).toUpperCase())}`);
        }

        const where = whereParts.length ? `where ${whereParts.join(' and ')}` : '';

        const countRows = await this.dataSource.query(
            `select count(*)::int as total from bdb_crime_master ${where}`,
            params
        );

        const sortBy = String(query.sortBy || 'jenis_nama').trim();
        const sortDir = String(query.sortDir || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
        const sortColumnMap: Record<string, string> = {
            kategori: 'lower(kategori)',
            jenis: 'lower(jenis_kejahatan)',
            nama: 'lower(nama_kejahatan_canonical)',
            dors_id: "case when dors_crime_id::text ~ '^[0-9]+$' then dors_crime_id::int else null end",
            status: 'lower(status)',
            id: 'id'
        };
        const jenisOrderExpr = `
            case
                when jenis_kejahatan = 'Konvensional' then 1
                when jenis_kejahatan = 'Transnasional' then 2
                when jenis_kejahatan = 'Kekayaan Negara' then 3
                when jenis_kejahatan = 'Kontingensi' then 4
                when jenis_kejahatan = 'PPA-PPO' then 5
                else 99
            end
        `;
        const orderBy = sortBy === 'jenis_nama'
            ? `order by ${jenisOrderExpr} ${sortDir}, lower(nama_kejahatan_canonical) ${sortDir} nulls last, id asc`
            : `order by ${sortColumnMap[sortBy] || sortColumnMap.nama} ${sortDir} nulls last, id asc`;

        params.push(limit, offset);

        const rows = await this.dataSource.query(
            `
            select
                id,
                kategori,
                jenis_kejahatan,
                nama_kejahatan_canonical,
                dors_crime_id,
                nama_kejahatan_dors,
                pasal,
                status
            from bdb_crime_master
            ${where}
            ${orderBy}
            limit $${params.length - 1}
            offset $${params.length}
            `,
            params
        );

        return {
            data: rows,
            meta: { page, limit, total: countRows[0]?.total || 0 }
        };
    }

    async updateKejahatan(idRaw: string, body: Record<string, any>) {
        const id = Number.parseInt(String(idRaw || ''), 10);

        if (!Number.isInteger(id) || id <= 0) {
            throw new BadRequestException('ID kejahatan tidak valid');
        }

        const existingRows = await this.dataSource.query(
            `
            select *
            from bdb_crime_master
            where id = $1
            limit 1
            `,
            [id]
        );

        if (!existingRows[0]) {
            throw new NotFoundException('Kejahatan tidak ditemukan');
        }

        const hasField = (key: string) => Object.prototype.hasOwnProperty.call(body || {}, key);
        const cleanText = (value: any) => {
            if (value === undefined || value === null) return null;
            const text = String(value).trim();
            return text === '' ? null : text;
        };

        const allowedColumns: Record<string, string> = {
            kategori: 'kategori',
            jenis_kejahatan: 'jenis_kejahatan',
            nama_kejahatan_canonical: 'nama_kejahatan_canonical',
            pasal: 'pasal',
            status: 'status'
        };

        const values: any[] = [];
        const updates: string[] = [];

        for (const [inputKey, columnName] of Object.entries(allowedColumns)) {
            if (!hasField(inputKey)) continue;

            const value = inputKey === 'status' ? cleanText(body[inputKey])?.toUpperCase() : cleanText(body[inputKey]);

            if (inputKey === 'nama_kejahatan_canonical' && !value) {
                throw new BadRequestException('Nama kejahatan wajib diisi');
            }

            values.push(value);
            updates.push(`${columnName} = $${values.length}`);
        }

        if (updates.length === 0) {
            throw new BadRequestException('Tidak ada field yang diubah');
        }

        values.push(id);

        // UPDATE ... RETURNING via DataSource.query() balikin tuple [rows[], affectedCount].
        const [rows] = await this.dataSource.query(
            `
            update bdb_crime_master
            set
                ${updates.join(',\n                ')},
                updated_at = now()
            where id = $${values.length}
            returning
                id,
                kategori,
                jenis_kejahatan,
                nama_kejahatan_canonical,
                dors_crime_id,
                nama_kejahatan_dors,
                pasal,
                status
            `,
            values
        );

        return { data: rows[0] };
    }

    async getLaporanPolisi(query: Record<string, any>) {
        const { page, limit, offset, search } = this.getPaging(query);
        const params: any[] = [];
        const whereParts: string[] = [];

        const addParam = (value: any) => {
            params.push(value);
            return `$${params.length}`;
        };

        if (search) {
            const searchParam = addParam(`%${search}%`);
            whereParts.push(`(
                lp.nomor_lp ilike ${searchParam}
                or coalesce(lp.bdb_lp_id, '') ilike ${searchParam}
                or lp.model_lp ilike ${searchParam}
                or lp.data_scope ilike ${searchParam}
                or lp.nama_kejahatan_canonical ilike ${searchParam}
                or coalesce(lp.uraian_singkat_operasional, lp.uraian_singkat, '') ilike ${searchParam}
                or sm.nama_satker_canonical ilike ${searchParam}
            )`);
        }

        const source = String(query.source || '').trim().toLowerCase();

        if (source === 'dors') {
            whereParts.push(`upper(coalesce(lp.data_scope, '')) <> 'TEST' and lp.dors_lp_id is not null`);
        } else if (source === 'manual') {
            whereParts.push(`upper(coalesce(lp.data_scope, '')) <> 'TEST' and lp.dors_lp_id is null`);
        } else if (source === 'testing') {
            whereParts.push(`upper(coalesce(lp.data_scope, '')) = 'TEST'`);
        }

        const modelLp = String(query.modelLp || query.model_lp || '').trim().toUpperCase();

        if (['A', 'B'].includes(modelLp)) {
            const p1 = addParam(modelLp);
            const p2 = addParam(`MODEL_${modelLp}`);
            const p3 = addParam(`LP_${modelLp}`);
            whereParts.push(`upper(coalesce(lp.model_lp, '')) in (${p1}, ${p2}, ${p3})`);
        }

        const dataScope = String(query.dataScope || query.data_scope || '').trim().toUpperCase();

        if (dataScope) {
            whereParts.push(`upper(coalesce(lp.data_scope, '')) = ${addParam(dataScope)}`);
        }

        const status = String(query.status || '').trim().toUpperCase();

        if (status) {
            whereParts.push(`upper(coalesce(lp.status, '')) = ${addParam(status)}`);
        }

        const tanggalAwal = String(query.tanggalAwal || query.tanggal_awal || query.startDate || query.start_date || '').trim();
        const tanggalAkhir = String(query.tanggalAkhir || query.tanggal_akhir || query.endDate || query.end_date || '').trim();
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (tanggalAwal && !datePattern.test(tanggalAwal)) {
            throw new BadRequestException('Tanggal awal tidak valid');
        }

        if (tanggalAkhir && !datePattern.test(tanggalAkhir)) {
            throw new BadRequestException('Tanggal akhir tidak valid');
        }

        if (tanggalAwal && tanggalAkhir && tanggalAwal > tanggalAkhir) {
            throw new BadRequestException('Tanggal awal tidak boleh lebih besar dari tanggal akhir');
        }

        if (tanggalAwal) {
            whereParts.push(`lp.tanggal_lp::date >= ${addParam(tanggalAwal)}::date`);
        }

        if (tanggalAkhir) {
            whereParts.push(`lp.tanggal_lp::date <= ${addParam(tanggalAkhir)}::date`);
        }

        const where = whereParts.length ? `where ${whereParts.join(' and ')}` : '';

        const countRows = await this.dataSource.query(
            `
            select count(*)::int as total
            from bdb_lp_master lp
            left join bdb_satker_master sm on sm.id = lp.satker_master_id
            ${where}
            `,
            params
        );

        params.push(limit, offset);

        const rows = await this.dataSource.query(
            `
            select
                lp.id,
                lp.dors_lp_id,
                lp.bdb_lp_id,
                lp.nomor_lp,
                lp.model_lp,
                lp.data_scope,
                lp.import_batch,
                lp.tanggal_lp,
                lp.nama_kejahatan_canonical,
                coalesce(lp.uraian_singkat_operasional, lp.uraian_singkat) as uraian_singkat,
                lp.uraian_singkat as uraian_singkat_dors,
                lp.uraian_singkat_operasional,
                coalesce(lp.tingkat_kesulitan, 'Belum dipilih') as tingkat_kesulitan,
                lp.status,
                case
                    when upper(coalesce(lp.data_scope, '')) = 'TEST' then 'Testing'
                    when lp.dors_lp_id is null then 'Manual'
                    else 'DORS'
                end as source_lp,
                sm.nama_satker_canonical as nama_satker_canonical,
                sm.nama_parent_satker_dors as nama_parent_satker_dors,
                sm.nama_grandparent_satker_dors as nama_grandparent_satker_dors,
                lp.tanggal_lp as tanggal_posisi_lp,
                cm.jenis_kejahatan as jenis_kejahatan
            from bdb_lp_master lp
            left join bdb_satker_master sm on sm.id = lp.satker_master_id
            left join bdb_crime_master cm on cm.id = lp.crime_master_id
            ${where}
            order by lp.tanggal_lp desc nulls last, lp.id desc
            limit $${params.length - 1}
            offset $${params.length}
            `,
            params
        );

        return {
            data: rows,
            meta: { page, limit, total: countRows[0]?.total || 0 }
        };
    }

    async updateLaporanPolisiDetail(id: string, body: Record<string, any>) {
        const lpMasterId = Number.parseInt(String(id || ''), 10);

        if (!Number.isInteger(lpMasterId) || lpMasterId <= 0) {
            throw new BadRequestException('LP tidak valid');
        }

        const uraianRaw = body?.uraian_singkat ?? body?.uraianSingkat ?? null;
        const uraianOperasional = typeof uraianRaw === 'string' && uraianRaw.trim() ? uraianRaw.trim() : null;
        const tingkatKesulitanRaw = String(body?.tingkat_kesulitan || body?.tingkatKesulitan || 'Belum dipilih').trim();
        const allowedDifficulty = ['Belum dipilih', 'Mudah', 'Sedang', 'Sulit', 'Sangat Sulit'];
        const tingkatKesulitan = allowedDifficulty.includes(tingkatKesulitanRaw) ? tingkatKesulitanRaw : 'Belum dipilih';

        // UPDATE ... RETURNING via DataSource.query() balikin tuple [rows[], affectedCount].
        const [rows] = await this.dataSource.query(
            `
            update bdb_lp_master lp
            set uraian_singkat_operasional = $2,
                tingkat_kesulitan = nullif($3, 'Belum dipilih'),
                detail_updated_at = now(),
                updated_at = now()
            from bdb_satker_master sm,
                 bdb_crime_master cm
            where lp.id = $1
              and sm.id = lp.satker_master_id
              and cm.id = lp.crime_master_id
            returning
                lp.id,
                lp.dors_lp_id,
                lp.bdb_lp_id,
                lp.nomor_lp,
                lp.model_lp,
                lp.data_scope,
                lp.import_batch,
                lp.tanggal_lp,
                lp.nama_kejahatan_canonical,
                coalesce(lp.uraian_singkat_operasional, lp.uraian_singkat) as uraian_singkat,
                lp.uraian_singkat as uraian_singkat_dors,
                lp.uraian_singkat_operasional,
                coalesce(lp.tingkat_kesulitan, 'Belum dipilih') as tingkat_kesulitan,
                lp.status,
                case
                    when upper(coalesce(lp.data_scope, '')) = 'TEST' then 'Testing'
                    when lp.dors_lp_id is null then 'Manual'
                    else 'DORS'
                end as source_lp,
                sm.nama_satker_canonical as nama_satker_canonical,
                sm.nama_parent_satker_dors as nama_parent_satker_dors,
                sm.nama_grandparent_satker_dors as nama_grandparent_satker_dors,
                lp.tanggal_lp as tanggal_posisi_lp,
                cm.jenis_kejahatan as jenis_kejahatan
            `,
            [lpMasterId, uraianOperasional, tingkatKesulitan]
        );

        if (!rows[0]) {
            throw new NotFoundException('LP tidak ditemukan');
        }

        return {
            status: 1,
            message: 'Detail LP berhasil disimpan',
            data: rows[0]
        };
    }

    async createLaporanPolisi(authUser: any, body: Record<string, any>) {
        const cleanText = (value: any) => {
            if (value === undefined || value === null) return null;
            const text = String(value).trim();
            return text === '' ? null : text;
        };

        const inputType = String(body.source || body.lp_source || body.jenis_input || '').trim().toLowerCase();

        if (!['manual', 'testing'].includes(inputType)) {
            throw new BadRequestException('Jenis input LP wajib dipilih');
        }

        const dataScope = inputType === 'testing' ? 'TEST' : 'OPERASIONAL';
        const nomorLp = cleanText(body.nomor_lp || body.nomorLp);
        const modelRaw = String(body.model_lp || body.modelLp || '').trim().toLowerCase();
        const tanggalLp = cleanText(body.tanggal_lp || body.tanggalLp);
        const uraianSingkat = cleanText(body.uraian_singkat || body.uraianSingkat);
        const actor = authUser?.user || authUser || {};
        const actorRole = String(actor?.role_bdb || actor?.role_name || authUser?.role_bdb || authUser?.role_name || '').trim().toLowerCase();
        const isSuperadmin = actorRole === 'superadmin' || actorRole.includes('super');
        const isAdminBinops = actorRole === 'admin_binops' || actorRole === 'admin' || actorRole.includes('binops');
        const requestedSatkerMasterId = Number.parseInt(String(body.satker_master_id || body.satkerMasterId || ''), 10);
        const actorScopeSatkerId = Number.parseInt(String(actor?.scope_satker_id || authUser?.scope_satker_id || ''), 10);
        const actorScopeSatkerKey = cleanText(actor?.scope_satker_key || authUser?.scope_satker_key);
        const satkerMasterId = isSuperadmin ? requestedSatkerMasterId : actorScopeSatkerId;
        const satkerMasterKey = isSuperadmin ? cleanText(body.satker_key || body.satkerKey) : actorScopeSatkerKey;
        const crimeMasterId = Number.parseInt(String(body.crime_master_id || body.crimeMasterId || ''), 10);

        if (!isSuperadmin && !isAdminBinops) {
            throw new BadRequestException('Hanya Superadmin dan Admin/Binops yang dapat menambah LP');
        }

        if (!nomorLp) {
            throw new BadRequestException('Nomor LP wajib diisi');
        }

        const modelLp = ['a', 'lp_a', 'lpa', 'lp_model_a'].includes(modelRaw)
            ? 'lp_model_a'
            : ['b', 'lp_b', 'lpb', 'lp_model_b'].includes(modelRaw)
              ? 'lp_model_b'
              : null;

        if (!modelLp) {
            throw new BadRequestException('Model LP wajib A atau B');
        }

        if (!tanggalLp || !/^\d{4}-\d{2}-\d{2}$/.test(tanggalLp)) {
            throw new BadRequestException('Tanggal LP tidak valid');
        }

        if ((!Number.isInteger(satkerMasterId) || satkerMasterId <= 0) && !satkerMasterKey) {
            throw new BadRequestException(isSuperadmin ? 'Satker wajib dipilih' : 'Akun belum melekat pada satker Binops');
        }

        if (!Number.isInteger(crimeMasterId) || crimeMasterId <= 0) {
            throw new BadRequestException('Kejahatan wajib dipilih');
        }

        const satkerRows = await this.dataSource.query(
            `
            select
                id,
                satker_key,
                nama_satker_canonical,
                nama_parent_satker_dors,
                nama_grandparent_satker_dors,
                dors_kode,
                manual_code,
                operational_role
            from bdb_satker_master
            where (($1::bigint is not null and id = $1::bigint)
               or ($2::text is not null and satker_key = $2::text))
              and upper(coalesce(operational_role, '')) = 'BINOPS'
              and coalesce(status, '') not in ('ARSIP_DUP_PARENT', 'ARSIP_TEST', 'Nonaktif')
            limit 1
            `,
            [Number.isInteger(satkerMasterId) && satkerMasterId > 0 ? satkerMasterId : null, satkerMasterKey]
        );

        const satker = satkerRows[0];

        if (!satker) {
            throw new NotFoundException('Satker Binops tidak ditemukan');
        }

        const resolvedSatkerMasterId = Number(satker.id);

        const crimeRows = await this.dataSource.query(
            `
            select id, nama_kejahatan_canonical, status
            from bdb_crime_master
            where id = $1
            limit 1
            `,
            [crimeMasterId]
        );

        const crime = crimeRows[0];

        if (!crime) {
            throw new NotFoundException('Kejahatan tidak ditemukan');
        }

        const duplicateRows = await this.dataSource.query(
            `
            select id
            from bdb_lp_master
            where lower(nomor_lp) = lower($1)
              and model_lp = $2
              and coalesce(data_scope, '') <> 'ARCHIVE'
            limit 1
            `,
            [nomorLp, modelLp]
        );

        if (duplicateRows[0]) {
            throw new BadRequestException('Nomor LP dengan model yang sama sudah ada');
        }

        const buildBdbPrefix = () => {
            const rawCode = String(satker.dors_kode || satker.manual_code || satker.satker_key || '').trim();
            const normalizedCode = rawCode.replace('.BDB-', '-');
            const match = normalizedCode.match(/^[0-9][0-9.-]*[0-9]/);

            if (match?.[0]) {
                return match[0].replace(/[-.]+$/g, '');
            }

            return String(satker.satker_key || 'BDB').replace(/[^A-Za-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '') || 'BDB';
        };

        const bdbPrefix = buildBdbPrefix();

        // Transaksi resolve ke hasil manager.query(update ... returning), tuple [rows[], affectedCount].
        const [rows] = await this.dataSource.transaction(async (manager) => {
            const inserted = await manager.query(
                `
                insert into bdb_lp_master (
                    dors_lp_id,
                    bdb_lp_id,
                    nomor_lp,
                    model_lp,
                    tanggal_lp,
                    satker_master_id,
                    crime_master_id,
                    nama_kejahatan_canonical,
                    uraian_singkat,
                    status,
                    data_scope,
                    import_batch
                )
                values (
                    null,
                    null,
                    $1,
                    $2,
                    $3::date,
                    $4,
                    $5,
                    $6,
                    $7,
                    'AKTIF',
                    $8,
                    $9
                )
                returning id
                `,
                [
                    nomorLp,
                    modelLp,
                    tanggalLp,
                    resolvedSatkerMasterId,
                    crimeMasterId,
                    crime.nama_kejahatan_canonical,
                    uraianSingkat,
                    dataScope,
                    inputType === 'testing' ? 'BDB_TESTING_MANUAL' : 'BDB_MANUAL'
                ]
            );

            const lpId = inserted[0].id;
            const bdbLpId = `${bdbPrefix}-BDB-${String(lpId).padStart(6, '0')}`;

            return manager.query(
                `
                update bdb_lp_master lp
                set bdb_lp_id = $1,
                    updated_at = now()
                from bdb_satker_master sm,
                     bdb_crime_master cm
                where lp.id = $2
                  and sm.id = lp.satker_master_id
                  and cm.id = lp.crime_master_id
                returning
                    lp.id,
                    lp.dors_lp_id,
                    lp.bdb_lp_id,
                    lp.nomor_lp,
                    lp.model_lp,
                    lp.data_scope,
                    lp.import_batch,
                    lp.tanggal_lp,
                    lp.nama_kejahatan_canonical,
                    coalesce(lp.uraian_singkat_operasional, lp.uraian_singkat) as uraian_singkat,
                    lp.uraian_singkat as uraian_singkat_dors,
                    lp.uraian_singkat_operasional,
                    coalesce(lp.tingkat_kesulitan, 'Belum dipilih') as tingkat_kesulitan,
                    lp.status,
                    case
                        when upper(coalesce(lp.data_scope, '')) = 'TEST' then 'Testing'
                        when lp.dors_lp_id is null then 'Manual'
                        else 'DORS'
                    end as source_lp,
                    sm.nama_satker_canonical as nama_satker_canonical,
                    sm.nama_parent_satker_dors as nama_parent_satker_dors,
                    sm.nama_grandparent_satker_dors as nama_grandparent_satker_dors,
                    lp.tanggal_lp as tanggal_posisi_lp,
                    cm.jenis_kejahatan as jenis_kejahatan
                `,
                [bdbLpId, lpId]
            );
        });

        return { data: rows[0] };
    }
}









