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
        description: 'Tambahan field: jenis_kejahatan, tindak_pidana (list — satu LP bisa punya lebih dari satu kategori/pasal).'
    },
    {
        code: 'laporan_polisi.status',
        label: 'Laporan Polisi — status & keterangan penghentian',
        description: 'Tambahan field: status_code/status_nama (LP/Lidik/Sidik/SPDP/SP2Lidik/SP3/Tahap I/II/P19/P21). Kalau statusnya SP2LIDIK atau SP3, ikut keluar keterangan_penghentian (alasan dihentikan + rincian/keterangan dari dokumennya).'
    },
    {
        code: 'laporan_polisi.penanganan',
        label: 'Laporan Polisi — satker & personel penanganan',
        description: 'Tambahan field: satker_penanganan, dan personel_penanganan (list — pembuat, penerima, & yang mengetahui, masing-masing dgn nama/NRP/pangkat).'
    },
    {
        code: 'laporan_polisi.pihak_terlibat',
        label: 'Laporan Polisi — pihak terlibat (termasuk nama & NIK)',
        description: 'Tambahan field: daftar pihak terlibat per LP (nama, NIK, jenis keterlibatan). Berisi data pribadi warga sipil.'
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
};

/** Petakan allowed_scopes klien -> flag kelompok field tambahan yg ikut keluar di response LP. */
export function buildLpDataFlags(scopes: string[]): LpDataFlags {
    return {
        klasifikasi: scopes.includes('laporan_polisi.klasifikasi'),
        status: scopes.includes('laporan_polisi.status'),
        penanganan: scopes.includes('laporan_polisi.penanganan'),
        pihakTerlibat: scopes.includes('laporan_polisi.pihak_terlibat'),
        barangBukti: scopes.includes('laporan_polisi.barang_bukti')
    };
}
