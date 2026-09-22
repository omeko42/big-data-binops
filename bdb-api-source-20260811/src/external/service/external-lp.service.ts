import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { encodeId, decodeId } from '../../bdb/laporan-polisi/id-cipher.util';
import { LpDataFlags } from '../../bdb/integration-client/scopes';

// Field dasar -- selalu keluar bila klien punya scope laporan_polisi.read. Field kelompok
// tambahan (klasifikasi/penanganan/pihak_terlibat/barang_bukti) ditambahkan kondisional lewat
// selectExtra()/joinsFor() sesuai allowed_scopes klien -- lihat scopes.ts::buildLpDataFlags.
const BASE_FIELDS = `lp.dors_lp_id, lp.no_laporan, lp.tgl_laporan, lp.model_lp, lp.status, lp.updated_at`;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Contoh data keluar untuk Portal Integrasi: hanya data_scope OPERASIONAL
 * (data TEST/dev tidak pernah keluar lewat jalur ini). ID diobfuskasi (id-cipher)
 * agar tidak bisa dienumerasi pihak luar.
 */
@Injectable()
export class ExternalLpService {
    constructor(private readonly dataSource: DataSource) {}

    private joinsFor(flags: LpDataFlags, forceJoinSm = false): string {
        const j: string[] = [];
        if (flags.klasifikasi) {
            j.push('left join cm_jenis_kejahatan jk on jk.id = lp.jenis_kejahatan_id');
            j.push('left join cm_golongan_kejahatan gk on gk.id = lp.golongan_kejahatan_id');
        }
        if (flags.status || forceJoinSm) j.push('left join bdb_status_master sm on sm.id = lp.status_id');
        if (flags.tkp) {
            j.push('left join cm_kategori_lokasi kl on kl.id = lp.kategori_lokasi_id');
            j.push('left join cm_provinsi prov on prov.code = lp.tkp_provinsi_code');
            j.push('left join cm_kabupaten kab on kab.code = lp.tkp_kabupaten_code');
            j.push('left join cm_kecamatann kec on kec.code = lp.tkp_kecamatan_code');
            j.push('left join cm_desa desa on desa.code = lp.tkp_desa_code');
        }
        return j.join(' ');
    }

    private selectExtra(flags: LpDataFlags): string {
        const parts: string[] = [];
        if (flags.klasifikasi) {
            parts.push(`
                gk.name as golongan_kejahatan,
                jk.keterangan as jenis_kejahatan,
                (select coalesce(jsonb_agg(x), '[]'::jsonb) from (
                    select distinct jsonb_build_object(
                        'kategori', coalesce(nullif(tp->>'nama_kategori_kejahatan',''), '(tanpa kategori)'),
                        'pasal', coalesce(nullif(tp->>'pasal_mapping',''), nullif(tp->>'pasal',''))
                    ) as x
                    from jsonb_array_elements(case when jsonb_typeof(lp.payload_json->'tindak_pidana')='array' then lp.payload_json->'tindak_pidana' else '[]'::jsonb end) tp
                ) d) as tindak_pidana
            `);
        }
        if (flags.status) {
            parts.push(`
                coalesce(sm.code,'LP') as status_code,
                coalesce(sm.nama,'Laporan Polisi') as status_nama,
                coalesce(sm.kategori, 'CT') as status_kategori,
                case when sm.kategori = 'CC' then true else false end as is_selesai,
                lp.tanggal_selesai,
                case 
                    when lp.dilimpahkan_eksternal then 'DILIMPAHKAN_EKSTERNAL'
                    when lp.sudah_dilimpahkan then 'DILIMPAHKAN_INTERNAL'
                    else 'TIDAK'
                end as status_pelimpahan,
                (select jsonb_build_object(
                    'jenis_dokumen', dtm.code,
                    'nomor_dokumen', dok.data->>'nomor_dokumen',
                    'tanggal_dokumen', dok.data->>'tanggal_dokumen',
                    'alasan_penghentian', dok.data->>'alasan_penghentian',
                    'alasan_demi_hukum', dok.data->>'alasan_demi_hukum',
                    'keterangan', dok.data->>'keterangan',
                    'kategori_perma', dok.data->>'kategori_perma',
                    'amar_ringkas', dok.data->>'amar_ringkas',
                    'pengadilan', dok.data->>'pengadilan'
                 )
                 from bdb_dokumen dok
                 join bdb_document_type_master dtm on dtm.id = dok.document_type_id
                 where dok.lp_id = lp.id and dtm.code in ('SP3','SP2_LIDIK','PERMA')
                 order by dok.created_at desc limit 1
                ) as keterangan_penghentian
            `);
        }
        if (flags.penanganan) {
            parts.push(`
                coalesce(nullif(lp.satker_nama, ''), nullif(trim(concat_ws(' ', lp.unit_nama, lp.satker_nama)), '')) as satker_penanganan,
                coalesce(nullif(lp.unit_satker_nama, ''), nullif(lp.unit_nama, '')) as unit_penanganan,
                (select coalesce(jsonb_agg(p), '[]'::jsonb) from (
                    select jsonb_build_object(
                        'peran', 'Pembuat',
                        'nama', nullif(lp.payload_json->>'nama_pembuat',''),
                        'nrp', nullif(lp.payload_json->>'nrp_pembuat',''),
                        'pangkat', nullif(lp.payload_json->>'pangkat_pembuat','')
                    ) as p
                    where nullif(lp.payload_json->>'nama_pembuat','') is not null
                    union all
                    select jsonb_build_object(
                        'peran', 'Penerima',
                        'nama', nullif(lp.payload_json->'petugas_penerima'->>'nama',''),
                        'nrp', coalesce(nullif(lp.payload_json->'petugas_penerima'->>'nrp_admin',''), nullif(lp.payload_json->>'nrp_penerima','')),
                        'pangkat', nullif(lp.payload_json->'petugas_penerima'->>'pangkat','')
                    )
                    where nullif(lp.payload_json->'petugas_penerima'->>'nama','') is not null
                    union all
                    select jsonb_build_object(
                        'peran', 'Mengetahui',
                        'nama', nullif(lp.payload_json->>'nama_mengetahui',''),
                        'nrp', nullif(lp.payload_json->>'nrp_mengetahui',''),
                        'pangkat', nullif(lp.payload_json->>'pangkat_mengetahui','')
                    )
                    where nullif(lp.payload_json->>'nama_mengetahui','') is not null
                ) x) as personel_penanganan
            `);
        }
        if (flags.tkp) {
            parts.push(`
                coalesce(nullif(lp.payload_json->>'waktu_kejadian_faktual',''), nullif(lp.payload_json->>'waktu_kejadian','')) as waktu_kejadian,
                nullif(lp.payload_json->>'tempat_kejadian','') as tempat_kejadian,
                kl.name as kategori_lokasi,
                prov.name as tkp_provinsi,
                kab.name as tkp_kabupaten,
                kec.name as tkp_kecamatan,
                desa.name as tkp_desa,
                nullif(lp.payload_json->>'lat','') as lat,
                nullif(lp.payload_json->>'lon','') as lon
            `);
        }
        if (flags.kronologi) {
            parts.push(`
                nullif(lp.payload_json->>'uraian_kejadian', '') as uraian_kejadian,
                nullif(lp.payload_json->>'apa_terjadi', '') as apa_terjadi,
                nullif(lp.payload_json->>'bagaimana_terjadi', '') as bagaimana_terjadi
            `);
        }
        if (flags.kerugian) {
            parts.push(`
                nullif(lp.payload_json->>'kerugian', '') as kerugian
            `);
        }
        if (flags.pihakTerlibat) {
            parts.push(`
                (select coalesce(jsonb_agg(jsonb_build_object('nama', pt.nama, 'nik', pt.nik, 'keterlibatan', pt.keterlibatan)), '[]'::jsonb)
                 from (
                    select t.nama, t.nik, upper(coalesce(t.keterlibatan, '-')) as keterlibatan
                    from bdb_dors_lp_terlibat t
                    join bdb_dors_lp d on d.id = t.lp_id
                    where d.dors_lp_id = lp.dors_lp_id and d.model_lp = lp.model_lp and t.nama is not null
                    union all
                    select m.nama, m.nik, upper(m.keterlibatan) as keterlibatan
                    from bdb_lp_pihak_manual m
                    where m.lp_id = lp.id and m.deleted_at is null
                 ) pt
                ) as pihak_terlibat
            `);
        }
        if (flags.barangBukti) {
            parts.push(`
                (select coalesce(jsonb_agg(jsonb_build_object('jenis', bb.jenis, 'jumlah', bb.jumlah, 'status', bb.status, 'keterangan', bb.keterangan)), '[]'::jsonb)
                 from (
                    select coalesce(elem.item->>'jenis_bb', elem.item->>'kode_bb', 'Barang Bukti') as jenis,
                            elem.item->>'jumlah' as jumlah, 'MASUK'::text as status,
                            nullif(elem.item->>'keterangan', '') as keterangan
                    from jsonb_array_elements(coalesce(lp.payload_json->'barang_bukti', '[]'::jsonb)) as elem(item)
                    union all
                    select m.jenis, m.jumlah, m.status, m.keterangan
                    from bdb_lp_barang_bukti_manual m
                    where m.lp_id = lp.id and m.deleted_at is null
                 ) bb
                ) as barang_bukti
            `);
        }
        return parts.length ? ', ' + parts.join(', ') : '';
    }

    async list(
        query: {
            page?: string;
            limit?: string;
            no_laporan?: string;
            status?: string;
            status_kategori?: string;
            satker?: string;
            updated_from?: string;
            updated_to?: string;
        },
        flags: LpDataFlags
    ) {
        const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10) || 20));
        const offset = (page - 1) * limit;

        const params: any[] = [];
        let where = "where lp.data_scope = 'OPERASIONAL'";
        let joinSm = false;

        if (query.no_laporan && query.no_laporan.trim()) {
            params.push(`%${query.no_laporan.trim()}%`);
            where += ` and lp.no_laporan ilike $${params.length}`;
        }
        if (query.satker && query.satker.trim()) {
            params.push(`%${query.satker.trim()}%`);
            where += ` and (lp.satker_nama ilike $${params.length} or lp.unit_satker_nama ilike $${params.length} or lp.unit_nama ilike $${params.length})`;
        }
        if (query.status && query.status.trim()) {
            joinSm = true;
            params.push(query.status.trim().toUpperCase());
            where += ` and upper(sm.code) = $${params.length}`;
        }
        if (query.status_kategori && query.status_kategori.trim()) {
            joinSm = true;
            params.push(query.status_kategori.trim().toUpperCase());
            where += ` and upper(sm.kategori) = $${params.length}`;
        }
        if (query.updated_from) {
            if (!DATE_RE.test(query.updated_from)) throw new BadRequestException('updated_from harus format YYYY-MM-DD.');
            params.push(query.updated_from);
            where += ` and lp.updated_at >= $${params.length}::date`;
        }
        if (query.updated_to) {
            if (!DATE_RE.test(query.updated_to)) throw new BadRequestException('updated_to harus format YYYY-MM-DD.');
            params.push(query.updated_to);
            where += ` and lp.updated_at < ($${params.length}::date + interval '1 day')`;
        }

        const countJoin = joinSm ? 'left join bdb_status_master sm on sm.id = lp.status_id' : '';
        const totalRows = await this.dataSource.query(`select count(*)::int as total from bdb_laporan_polisi lp ${countJoin} ${where}`, params);
        const rows = await this.dataSource.query(
            `select lp.id, ${BASE_FIELDS}${this.selectExtra(flags)}
             from bdb_laporan_polisi lp
             ${this.joinsFor(flags, joinSm)}
             ${where}
             order by lp.updated_at desc limit ${limit} offset ${offset}`,
            params
        );

        return {
            status: 1,
            data: rows.map((r: any) => this.toExternal(r)),
            meta: { page, limit, total: totalRows[0]?.total || 0 }
        };
    }

    async detail(token: string, flags: LpDataFlags) {
        const id = decodeId(token);
        if (!id) throw new NotFoundException('Laporan Polisi tidak ditemukan.');
        const rows = await this.dataSource.query(
            `select lp.id, ${BASE_FIELDS}${this.selectExtra(flags)}
             from bdb_laporan_polisi lp
             ${this.joinsFor(flags)}
             where lp.id=$1 and lp.data_scope='OPERASIONAL'`,
            [id]
        );
        if (!rows.length) throw new NotFoundException('Laporan Polisi tidak ditemukan.');
        return { status: 1, data: this.toExternal(rows[0]) };
    }

    private toExternal(r: any) {
        const { id, ...rest } = r;
        return { id: encodeId(id), ...rest };
    }
}
