import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
export class UpdateReportDto {
    @ApiProperty({
        description: 'Nomor laporan',
        example: 'LP/B/2/I/2024/SPKT.BARESKRIM POLRI'
    })
    @IsOptional()
    nomor: string;

    @ApiProperty({
        description: 'Tanggal laporan',
        example: '2024-01-01'
    })
    @IsOptional()
    tanggal: string;

    @ApiProperty({
        description: 'Pasal yang dilanggar',
        example: '28 (2) UU No. 19 Thn 2016, 14 (1) (2), 15 KUHP, 207 KUHP'
    })
    @IsOptional()
    pasal: string;

    @ApiProperty({
        description: 'Uraian kejadian',
        example: 'Sara, pemberitaan bohong yang mengakibatkan keonaran dan penghinaan terhadap KPU'
    })
    @IsOptional()
    uraian_kejadian: string;

    @ApiProperty({
        description: 'Pelapor',
        example: 'AULIA FAHMI, SH'
    })
    @IsOptional()
    pelapor: string;

    @ApiProperty({
        description: 'Tersangka',
        example: 'Pemilik atau pengguna akun Twitter @KRMTroySuryo1'
    })
    @IsOptional()
    tersangka: string;

    @ApiProperty({
        description: 'Barang bukti',
        example: 'Fc berkas'
    })
    @IsOptional()
    barang_bukti: string;

    @ApiProperty({
        description: 'Tujuan penyaluran',
        example: null
    })
    @IsOptional()
    tujuan_penyaluran: string | null;

    @ApiProperty({
        description: 'Bukti penyaluran',
        example: 'B/ND-12/I/RES 7.4/ 2024 / Robinopsnal'
    })
    @IsOptional()
    bukti_penyaluran: string;

    // @ApiProperty({
    //     description: 'Tanggal penyaluran',
    //     example: null
    // })
    // @IsOptional()
    // tanggal_penyaluran: Date | null;

    @ApiProperty({
        description: 'Tanggal penyaluran',
        example: null
    })
    @IsOptional()
    report_status_date: Date | null;

    @ApiProperty({
        description: 'Model LP',
        example: 'B'
    })
    @IsOptional()
    model_lp: string;

    @ApiProperty({
        description: 'Sumber laporan',
        example: 'BUKU B1 ROBINOPS'
    })
    @IsOptional()
    sumber: string;

    @ApiProperty({
        description: 'Keterangan sumber',
        example: 'PENYALURAN'
    })
    @IsOptional()
    ket_sumber: string;

    @ApiProperty({
        description: 'Ceklist cross-check',
        example: ''
    })
    @IsOptional()
    ceklist_croscek: string;

    @ApiProperty({
        description: 'Status laporan',
        example: null
    })
    @IsOptional()
    status: string | null;

    @ApiProperty({
        description: 'Status laporan',
        example: { id: 1 }
    })
    @IsOptional()
    directorate_id: number | null;

    @ApiProperty({
        description: 'Status laporan',
        example: { id: 1 }
    })
    @IsOptional()
    report_status_id: number | null;

    // @ApiProperty({
    //     description: 'kategori laporan',
    //     example: { id: 1 }
    // })
    // @IsOptional()
    // report_kategori_lp_id: number | null;

    @ApiProperty({
        description: 'jenis kejahatan',
        example: { id: 1 }
    })
    @IsOptional()
    jenis_kejahatan_id: number | null;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'dokumen bukti dinyatakan'
    })
    @IsOptional()
    file: any;
}

export class createManualReportDto {
    @ApiProperty({
        example: '1'
    })
    @IsOptional()
    id: number;

    @ApiProperty({
        description: 'Nomor laporan',
        example: 'LP/B/2/I/2024/SPKT.BARESKRIM POLRI'
    })
    //@IsNotEmpty()
    nomor: string;

    @ApiProperty({
        description: 'Tanggal laporan',
        example: '2024-01-01'
    })
    //@IsNotEmpty()
    tanggal: string;

    @ApiProperty({
        description: 'Pasal yang dilanggar',
        example: '28 (2) UU No. 19 Thn 2016, 14 (1) (2), 15 KUHP, 207 KUHP'
    })
    //@IsNotEmpty()
    pasal: string;

    @ApiProperty({
        description: 'Uraian kejadian',
        example: 'Sara, pemberitaan bohong yang mengakibatkan keonaran dan penghinaan terhadap KPU'
    })
    //@IsNotEmpty()
    uraian_kejadian: string;

    @ApiProperty({
        description: 'Pelapor',
        example: 'AULIA FAHMI, SH'
    })
    //@IsNotEmpty()
    pelapor: string;

    @ApiProperty({
        description: 'Tersangka',
        example: 'Pemilik atau pengguna akun Twitter @KRMTroySuryo1'
    })
    //@IsNotEmpty()
    tersangka: string;

    @ApiProperty({
        description: 'Barang bukti',
        example: 'Fc berkas'
    })
    //@IsNotEmpty()
    barang_bukti: string;

    @ApiProperty({
        description: 'Tujuan penyaluran',
        example: 'Some destination'
    })
    //@IsNotEmpty()
    tujuan_penyaluran: string;

    @ApiProperty({
        description: 'Bukti penyaluran',
        example: 'B/ND-12/I/RES 7.4/2024/Robinopsnal'
    })
    //@IsNotEmpty()
    bukti_penyaluran: string;

    @ApiProperty({
        description: 'Tanggal penyaluran',
        example: '2024-01-01'
    })
    //@IsNotEmpty()
    tanggal_penyaluran: string;

    @ApiProperty({
        description: 'Model LP (A or B)',
        example: 'B'
    })
    //@IsNotEmpty()
    @IsIn(['A', 'B'])
    model_lp: string;

    @ApiProperty({
        description: 'Sumber laporan',
        example: 'BUKU B1 ROBINOPS'
    })
    //@IsNotEmpty()
    sumber: string;

    @ApiProperty({
        description: 'Keterangan sumber',
        example: 'PENYALURAN'
    })
    //@IsNotEmpty()
    ket_sumber: string;

    @ApiProperty({
        description: 'Ceklist cross-check',
        example: 'Cek 1, Cek 2'
    })
    //@IsNotEmpty()
    ceklist_croscek: string;

    @ApiProperty({
        description: 'Status laporan',
        example: 'Active'
    })
    //@IsNotEmpty()
    status: string;

    @ApiProperty({
        description: 'ID direktorat',
        example: 1
    })
    //@IsNotEmpty()
    directorate_id: number;

    @ApiProperty({
        description: 'ID status laporan',
        example: 1
    })
    report_status_id: number;

    // @ApiProperty({
    //     description: 'kategori laporan',
    //     example: { id: 1 }
    // })
    // @IsOptional()
    // report_kategori_lp_id: number | null;

    @ApiProperty({
        description: 'jenis kejahatan',
        example: { id: 1 }
    })
    @IsOptional()
    jenis_kejahatan_id: number | null;
}
export class UpdateStatusReportDto {
    @ApiProperty({
        description: 'Tanggal penyaluran',
        example: null
    })
    @IsNotEmpty()
    report_status_date: string;

    @ApiProperty({
        description: 'Status laporan',
        example: { id: 1 }
    })
    @IsNotEmpty()
    report_status_id: string;

    @ApiProperty({})
    @IsNotEmpty()
    bukti_dinyatakan: string;
}
export class TestUpdateDocumenDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'dokumen bukti dinyatakan'
    })
    @IsOptional()
    file: any;
}
export class UpdateKategoriLpReportDto {
    @ApiProperty({
        example: 1
    })
    @IsNotEmpty()
    kategori_lp_id: number;
}
export class UpdateDistribusiReportDto {
    @ApiProperty({
        description: 'Organisasi',
        example: { id: 1 }
    })
    @IsOptional()
    organisasi_id: string;

    @ApiProperty({
        description: 'Organisasi',
        example: { id: 1 }
    })
    @IsOptional()
    external_organisai: string;

    @ApiProperty({
        description: 'Tanggal penyaluran',
        example: null
    })
    @IsNotEmpty()
    report_status_date: string;

    @ApiProperty({
        description: 'internal / external',
        example: 'internal'
    })
    @IsNotEmpty()
    type_distribusi: string;

    @ApiProperty({})
    @IsNotEmpty()
    bukti_dinyatakan: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'dokumen bukti dinyatakan'
    })
    @IsOptional()
    file: any;

    @ApiProperty({
        description: 'Organisasi',
        example: { id: 1 }
    })
    @IsOptional()
    keterangan_tambahan: string;
}
