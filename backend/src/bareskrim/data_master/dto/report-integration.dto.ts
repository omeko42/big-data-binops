import { ApiProperty, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsInt, IsOptional, IsDateString, IsEmail, IsEnum, IsBoolean, IsIn } from 'class-validator';

export class CreateReportIntegrationDto {
    @ApiProperty({
        description: 'Nomor laporan',
        example: 'LP/B/2/I/2024/SPKT.BARESKRIM POLRI'
    })
    @IsNotEmpty()
    nomor: string;

    @ApiProperty({
        description: 'id laporan integrasi',
        example: '234'
    })
    integration_id: number;

    @ApiProperty({
        description: 'Tanggal laporan',
        example: '2024-01-01'
    })
    @IsNotEmpty()
    tanggal: string;

    @ApiProperty({
        description: 'Pasal yang dilanggar',
        example: '28 (2) UU No. 19 Thn 2016, 14 (1) (2), 15 KUHP, 207 KUHP'
    })
    @IsNotEmpty()
    pasal: string;

    @ApiProperty({
        description: 'Uraian kejadian',
        example: 'Sara, pemberitaan bohong yang mengakibatkan keonaran dan penghinaan terhadap KPU'
    })
    @IsNotEmpty()
    uraian_kejadian: string;

    @ApiProperty({
        description: 'Pelapor',
        example: 'AULIA FAHMI, SH'
    })
    @IsNotEmpty()
    pelapor: string;

    @ApiProperty({
        description: 'Tersangka',
        example: 'Pemilik atau pengguna akun Twitter @KRMTroySuryo1'
    })
    @IsNotEmpty()
    tersangka: string;

    @ApiProperty({
        description: 'Barang bukti',
        example: 'Fc berkas'
    })
    @IsNotEmpty()
    barang_bukti: string;

    @ApiProperty({
        description: 'Tujuan penyaluran',
        example: 'Some destination'
    })
    @IsNotEmpty()
    tujuan_penyaluran: string;

    @ApiProperty({
        description: 'Bukti penyaluran',
        example: 'B/ND-12/I/RES 7.4/2024/Robinopsnal'
    })
    @IsNotEmpty()
    bukti_penyaluran: string;

    @ApiProperty({
        description: 'Tanggal penyaluran',
        example: '2024-01-01'
    })
    @IsNotEmpty()
    tanggal_penyaluran: string;

    @ApiProperty({
        description: 'Model LP (A or B)',
        example: 'B'
    })
    @IsNotEmpty()
    @IsIn(['A', 'B'])
    model_lp: string;

    @ApiProperty({
        description: 'Sumber laporan',
        example: 'BUKU B1 ROBINOPS'
    })
    @IsNotEmpty()
    sumber: string;

    @ApiProperty({
        description: 'Keterangan sumber',
        example: 'PENYALURAN'
    })
    @IsNotEmpty()
    ket_sumber: string;

    @ApiProperty({
        description: 'Ceklist cross-check',
        example: 'Cek 1, Cek 2'
    })
    @IsNotEmpty()
    ceklist_croscek: string;

    @ApiProperty({
        description: 'Status laporan',
        example: 'Active'
    })
    @IsNotEmpty()
    status: string;

    @ApiProperty({
        description: 'ID direktorat',
        example: 1
    })
    @IsNotEmpty()
    directorate_id: number;

    @ApiProperty({
        description: 'ID status laporan',
        example: 1
    })
    @IsNotEmpty()
    report_status_id: number;

    // ------------------- ews fields -------------------
    @IsOptional()
    @IsString()
    no_sttlp: string;

    @IsOptional()
    @IsDateString()
    waktu_kejadian: string;

    @IsOptional()
    @IsString()
    tempat_kejadian: string;

    @IsOptional()
    @IsString()
    apa_terjadi: string;

    @IsOptional()
    @IsString()
    bagaimana_terjadi: string;

    @IsOptional()
    @IsString()
    uraian_singkat_kejadian: string;

    @IsInt()
    id_satuan: number;

    @IsInt()
    id_kantor: number;

    @IsString()
    lokasi: string;

    @IsString()
    nama_pembuat: string;

    @IsString()
    pangkat_pembuat: string;

    @IsString()
    nrp_pembuat: string;

    @IsString()
    nama_mengetahui: string;

    @IsString()
    pangkat_mengetahui: string;

    @IsString()
    nrp_mengetahui: string;

    @IsString()
    nama_penerima: string;

    @IsString()
    nrp_penerima: string;

    @IsString()
    pangkat_penerima: string;

    @IsOptional()
    @IsString()
    telpon_penerima: string;

    @IsOptional()
    @IsString()
    email_penerima: string;

    @IsOptional()
    @IsString()
    username_penerima: string;

    @IsOptional()
    @IsString()
    keterangan: string;

    @IsOptional()
    @IsString()
    catatan_kepolisian: string;

    @IsOptional()
    @IsString()
    ck_barang_bukti: string;

    @IsOptional()
    @IsString()
    ck_tindakan_diambil: string;

    @IsOptional()
    @IsString()
    ck_tindak_pidana: string;

    @IsOptional()
    @IsNumber()
    kerugian: number;

    @IsOptional()
    @IsString()
    pasal_mapping_tindak_pidana: string;

    @IsOptional()
    id_pasal_kamtibmas: number;

    @IsOptional()
    id_emp_modus_operandi: number;

    @IsOptional()
    id_kategori_lokasi: number;

    @IsOptional()
    @IsString()
    ket_pasal_kamtibmas: string;

    @IsOptional()
    @IsString()
    pasal_kamtibmas: string;

    @IsOptional()
    @IsBoolean()
    street_crime: boolean;

    @IsOptional()
    @IsBoolean()
    status_selesai: boolean;

    @IsOptional()
    @IsBoolean()
    kasus_menonjol: boolean;

    @IsOptional()
    @IsBoolean()
    status_aktif: boolean;

    @IsOptional()
    @IsString()
    zona_waktu: string;

    @IsOptional()
    @IsString()
    g_rev_formatted_address: string;

    @IsOptional()
    @IsNumber()
    g_rev_lat: number;

    @IsOptional()
    @IsNumber()
    g_rev_lon: number;

    @IsOptional()
    @IsInt()
    pelimpahan: number;

    @IsOptional()
    @IsInt()
    dilimpahkan: number;

    // ------------------- Relations -------------------
    @IsOptional()
    id_log_import: number;

    @IsOptional()
    id_report_status: number;

    @IsOptional()
    id_directorate: number;

    @IsOptional()
    id_provinsi: number;

    @IsOptional()
    id_kabupaten: number;

    @IsOptional()
    id_kecamatan: number;

    @IsOptional()
    id_desa: number;

    @IsOptional()
    id_polda: string;

    @IsOptional()
    id_polres: string;

    @IsOptional()
    id_polsek: string;
}

export class UpdateReportIntegrationDto {
    @ApiProperty({
        description: 'Nomor laporan',
        example: 'LP/B/2/I/2024/SPKT.BARESKRIM POLRI'
    })
    @IsNotEmpty()
    nomor: string;

    @ApiProperty({
        description: 'Tanggal laporan',
        example: '2024-01-01'
    })
    @IsNotEmpty()
    tanggal: string;

    @ApiProperty({
        description: 'Pasal yang dilanggar',
        example: '28 (2) UU No. 19 Thn 2016, 14 (1) (2), 15 KUHP, 207 KUHP'
    })
    @IsNotEmpty()
    pasal: string;

    @ApiProperty({
        description: 'Uraian kejadian',
        example: 'Sara, pemberitaan bohong yang mengakibatkan keonaran dan penghinaan terhadap KPU'
    })
    @IsNotEmpty()
    uraian_kejadian: string;

    @ApiProperty({
        description: 'Pelapor',
        example: 'AULIA FAHMI, SH'
    })
    @IsNotEmpty()
    pelapor: string;

    @ApiProperty({
        description: 'Tersangka',
        example: 'Pemilik atau pengguna akun Twitter @KRMTroySuryo1'
    })
    @IsNotEmpty()
    tersangka: string;

    @ApiProperty({
        description: 'Barang bukti',
        example: 'Fc berkas'
    })
    @IsNotEmpty()
    barang_bukti: string;

    @ApiProperty({
        description: 'Tujuan penyaluran',
        example: 'Some destination'
    })
    @IsNotEmpty()
    tujuan_penyaluran: string;

    @ApiProperty({
        description: 'Bukti penyaluran',
        example: 'B/ND-12/I/RES 7.4/2024/Robinopsnal'
    })
    @IsNotEmpty()
    bukti_penyaluran: string;

    @ApiProperty({
        description: 'Tanggal penyaluran',
        example: '2024-01-01'
    })
    @IsNotEmpty()
    tanggal_penyaluran: string;

    @ApiProperty({
        description: 'Model LP (A or B)',
        example: 'B'
    })
    @IsNotEmpty()
    @IsIn(['A', 'B'])
    model_lp: string;

    @ApiProperty({
        description: 'Sumber laporan',
        example: 'BUKU B1 ROBINOPS'
    })
    @IsNotEmpty()
    sumber: string;

    @ApiProperty({
        description: 'Keterangan sumber',
        example: 'PENYALURAN'
    })
    @IsNotEmpty()
    ket_sumber: string;

    @ApiProperty({
        description: 'Ceklist cross-check',
        example: 'Cek 1, Cek 2'
    })
    @IsNotEmpty()
    ceklist_croscek: string;

    @ApiProperty({
        description: 'Status laporan',
        example: 'Active'
    })
    @IsNotEmpty()
    status: string;

    @ApiProperty({
        description: 'ID direktorat',
        example: 1
    })
    @IsNotEmpty()
    directorate_id: number;

    @ApiProperty({
        description: 'ID status laporan',
        example: 1
    })
    @IsNotEmpty()
    report_status_id: number;

    // ------------------- ews fields -------------------
    @IsOptional()
    @IsString()
    no_sttlp: string;

    @IsOptional()
    @IsDateString()
    waktu_kejadian: string;

    @IsOptional()
    @IsString()
    tempat_kejadian: string;

    @IsOptional()
    @IsString()
    apa_terjadi: string;

    @IsOptional()
    @IsString()
    bagaimana_terjadi: string;

    @IsOptional()
    @IsString()
    uraian_singkat_kejadian: string;

    @IsInt()
    id_satuan: number;

    @IsInt()
    id_kantor: number;

    @IsString()
    lokasi: string;

    @IsString()
    nama_pembuat: string;

    @IsString()
    pangkat_pembuat: string;

    @IsString()
    nrp_pembuat: string;

    @IsString()
    nama_mengetahui: string;

    @IsString()
    pangkat_mengetahui: string;

    @IsString()
    nrp_mengetahui: string;

    @IsString()
    nama_penerima: string;

    @IsString()
    nrp_penerima: string;

    @IsString()
    pangkat_penerima: string;

    @IsOptional()
    @IsString()
    telpon_penerima: string;

    @IsOptional()
    @IsString()
    email_penerima: string;

    @IsOptional()
    @IsString()
    username_penerima: string;

    @IsOptional()
    @IsString()
    keterangan: string;

    @IsOptional()
    @IsString()
    catatan_kepolisian: string;

    @IsOptional()
    @IsString()
    ck_barang_bukti: string;

    @IsOptional()
    @IsString()
    ck_tindakan_diambil: string;

    @IsOptional()
    @IsString()
    ck_tindak_pidana: string;

    @IsOptional()
    @IsNumber()
    kerugian: number;

    @IsOptional()
    @IsString()
    pasal_mapping_tindak_pidana: string;

    @IsOptional()
    id_pasal_kamtibmas: string;

    @IsOptional()
    id_emp_modus_operandi: number;

    @IsOptional()
    id_kategori_lokasi: number;

    @IsOptional()
    @IsString()
    ket_pasal_kamtibmas: string;

    @IsOptional()
    @IsString()
    pasal_kamtibmas: string;

    @IsOptional()
    @IsBoolean()
    street_crime: boolean;

    @IsOptional()
    @IsBoolean()
    status_selesai: boolean;

    @IsOptional()
    @IsBoolean()
    kasus_menonjol: boolean;

    @IsOptional()
    @IsBoolean()
    status_aktif: boolean;

    @IsOptional()
    @IsString()
    zona_waktu: string;

    @IsOptional()
    @IsString()
    g_rev_formatted_address: string;

    @IsOptional()
    @IsNumber()
    g_rev_lat: number;

    @IsOptional()
    @IsNumber()
    g_rev_lon: number;

    @IsOptional()
    @IsInt()
    pelimpahan: number;

    @IsOptional()
    @IsInt()
    dilimpahkan: number;

    // ------------------- Relations -------------------
    @IsOptional()
    id_log_import: number;

    @IsOptional()
    id_report_status: number;

    @IsOptional()
    id_directorate: number;

    @IsOptional()
    id_provinsi: number;

    @IsOptional()
    id_kabupaten: number;

    @IsOptional()
    id_kecamatan: number;

    @IsOptional()
    id_desa: number;

    @IsOptional()
    id_polda: string;

    @IsOptional()
    id_polres: string;

    @IsOptional()
    id_polsek: string;
}
