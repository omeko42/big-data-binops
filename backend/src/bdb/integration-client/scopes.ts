// Registry scope API keluar. Tambah entri di sini setiap kali ada endpoint /external/v1/*
// baru yang boleh diberikan ke klien integrasi secara terpisah (izin granular per klien).
//
// laporan_polisi.read = wajib dimiliki utk bisa memanggil /external/v1/laporan-polisi sama
// sekali (field dasar: id, id_dors, no LP, tanggal LP, model LP). 5 scope
// "laporan_polisi.*" lain bersifat TAMBAHAN -- tiap satu dicentang, satu kelompok field
// tambahan ikut keluar di response (lihat buildLpDataFlags & external-lp.service.ts).
export const EXTERNAL_API_SCOPES = [
    {
        code: 'laporan_polisi.read',
        label: 'Laporan Polisi — data dasar',
        description: 'Wajib dipilih utk bisa mengakses /external/v1/laporan-polisi. Field: id, id_dors, no LP, tanggal LP, model LP.'
    },
    {
        code: 'laporan_polisi.klasifikasi',
        label: 'Laporan Polisi — jenis kejahatan & tindak pidana',
        description: 'Tambahan field: golongan_kejahatan (Konvensional/Transnasional/Kekayaan Negara/Kontinjensi/PPAPPO), jenis_kejahatan, dan tindak_pidana (list — satu LP bisa punya lebih dari satu kategori/pasal).'
    },
    {
        code: 'laporan_polisi.status',
        label: 'Laporan Polisi — status penanganan & penyelesaian (CC/CT)',
        description: 'Tambahan field: status_code, status_nama, status_kategori (CC=Selesai, CT=Proses), is_selesai (true/false), tanggal_selesai, status_pelimpahan (TIDAK/INTERNAL/EKSTERNAL), serta keterangan_penghentian (alasan dihentikan SP3/SP2Lidik/RJ/Diversi atau amar putusan sidang Tipiring/PERMA).'
    },
    {
        code: 'laporan_polisi.penanganan',
        label: 'Laporan Polisi — satker & personel penanganan',
        description: 'Tambahan field: satker_penanganan, unit_penanganan (subsatker/unit terkini), dan personel_penanganan (list — pembuat, penerima, & yang mengetahui, masing-masing dgn nama/NRP/pangkat).'
    },
    {
        code: 'laporan_polisi.tkp',
        label: 'Laporan Polisi — TKP & waktu kejadian',
        description: 'Tambahan field: waktu_kejadian, tempat_kejadian, kategori_lokasi, wilayah TKP (provinsi, kabupaten/kota, kecamatan, desa/kelurahan), serta titik koordinat lat/lon jika tersedia.'
    },
    {
        code: 'laporan_polisi.pihak_terlibat',
        label: 'Laporan Polisi — pihak terlibat (termasuk nama & NIK)',
        description: 'Tambahan field: daftar pihak terlibat per LP (nama, NIK, jenis keterlibatan). Berisi data pribadi warga sipil.'
    },
    {
        code: 'laporan_polisi.kronologi',
        label: 'Laporan Polisi — kronologi / uraian kejadian',
        description: 'Tambahan field: uraian_kejadian (narasi kronologi lengkap), apa_terjadi, bagaimana_terjadi (modus operandi). Data investigasi penanganan perkara.'
    },
    {
        code: 'laporan_polisi.kerugian',
        label: 'Laporan Polisi — nilai kerugian materiil',
        description: 'Tambahan field: kerugian (nilai taksiran kerugian materiil korban).'
    },
    {
        code: 'laporan_polisi.barang_bukti',
        label: 'Laporan Polisi — barang bukti',
        description: 'Tambahan field: daftar barang bukti per LP (jenis, jumlah, status, keterangan).'
    }
] as const;

export type ExternalApiScopeCode = (typeof EXTERNAL_API_SCOPES)[number]['code'];
export const EXTERNAL_API_SCOPE_CODES: string[] = EXTERNAL_API_SCOPES.map(s => s.code);

export type LpDataFlags = {
    klasifikasi: boolean;
    status: boolean;
    penanganan: boolean;
    pihakTerlibat: boolean;
    barangBukti: boolean;
    tkp: boolean;
    kronologi: boolean;
    kerugian: boolean;
};

/** Petakan allowed_scopes klien -> flag kelompok field tambahan yg ikut keluar di response LP. */
export function buildLpDataFlags(scopes: string[]): LpDataFlags {
    return {
        klasifikasi: scopes.includes('laporan_polisi.klasifikasi'),
        status: scopes.includes('laporan_polisi.status'),
        penanganan: scopes.includes('laporan_polisi.penanganan'),
        pihakTerlibat: scopes.includes('laporan_polisi.pihak_terlibat'),
        barangBukti: scopes.includes('laporan_polisi.barang_bukti'),
        tkp: scopes.includes('laporan_polisi.tkp'),
        kronologi: scopes.includes('laporan_polisi.kronologi'),
        kerugian: scopes.includes('laporan_polisi.kerugian')
    };
}
