import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePolsekDto {
    @ApiProperty({
        description: 'Kode Polda',
        type: String
    })
    @IsString()
    code: string;

    @ApiProperty({
        description: 'Nama Polda',
        type: String
    })
    @IsString()
    nama: string;

    @ApiProperty({
        description: 'Status Polda',
        type: String
    })
    @IsString()
    status: string;

    @ApiProperty({
        description: 'Alamat Polda',
        type: String
    })
    @IsString()
    alamat: string;

    @ApiProperty({
        description: 'Telepon Polda',
        type: String
    })
    @IsString()
    telpon: string;

    @ApiProperty({
        description: 'NRP Kepala Polda',
        type: String,
        required: false
    })
    @IsOptional()
    @IsString()
    nrp_kepala: string;

    @ApiProperty({
        description: 'Latitude Polda',
        type: Number
    })
    @IsDecimal()
    lat: number;

    @ApiProperty({
        description: 'Longitude Polda',
        type: Number
    })
    @IsDecimal()
    lon: number;

    @ApiProperty({
        description: 'Singkatan Polda',
        type: String
    })
    @IsString()
    singkat: string;

    @ApiProperty({
        description: 'Abbreviation Polda',
        type: String
    })
    @IsString()
    abbr: string;

    @ApiProperty({
        description: 'Jumlah Penduduk Polda',
        type: Number
    })
    @IsNumber()
    jml_penduduk: number;

    @ApiProperty({
        description: 'Status Online SP2HP',
        type: Boolean
    })
    @IsBoolean()
    is_sp2hp_online: boolean;

    @ApiProperty({
        description: 'Kode Kota Polda',
        type: Number
    })
    @IsNumber()
    kode_kota: number;

    @ApiProperty({
        description: 'Kode Depkeu',
        type: String,
        required: false
    })
    @IsOptional()
    @IsString()
    kode_depkeu: string;

    @ApiProperty({
        description: 'Kode Pusiknas',
        type: String
    })
    @IsString()
    kode_pusiknas: string;

    @ApiProperty({
        description: 'Kode Polda Baru',
        type: String,
        required: false
    })
    @IsOptional()
    @IsString()
    kode_polda_new: string;

    @ApiProperty({
        description: 'Polda Polisiku',
        type: String,
        required: false
    })
    @IsOptional()
    @IsString()
    polda_polisiku: string;

    @ApiProperty({
        description: 'Nama Siaga A',
        type: String
    })
    @IsString()
    siaga_a_nama: string;

    @ApiProperty({
        description: 'Pangkat Siaga A',
        type: String
    })
    @IsString()
    siaga_a_pangkat: string;

    @ApiProperty({
        description: 'NRP Siaga A',
        type: Number
    })
    @IsNumber()
    siaga_a_nrp: number;

    @ApiProperty({
        description: 'Nama Siaga B',
        type: String
    })
    @IsString()
    siaga_b_nama: string;

    @ApiProperty({
        description: 'Pangkat Siaga B',
        type: String
    })
    @IsString()
    siaga_b_pangkat: string;

    @ApiProperty({
        description: 'NRP Siaga B',
        type: Number
    })
    @IsNumber()
    siaga_b_nrp: number;

    @ApiProperty({
        description: 'Nama Siaga C',
        type: String
    })
    @IsString()
    siaga_c_nama: string;

    @ApiProperty({
        description: 'Pangkat Siaga C',
        type: String
    })
    @IsString()
    siaga_c_pangkat: string;

    @ApiProperty({
        description: 'NRP Siaga C',
        type: Number
    })
    @IsNumber()
    siaga_c_nrp: number;

    @ApiProperty({
        description: 'Alamat Web Polda',
        type: String
    })
    @IsString()
    alamat_web: string;

    @ApiProperty({
        description: 'Luas Wilayah Polda',
        type: Number
    })
    @IsNumber()
    luas_wilayah: number;

    @ApiProperty({
        description: 'Jumlah Pers DSP',
        type: Number
    })
    @IsNumber()
    jml_pers_dsp: number;

    @ApiProperty({
        description: 'Jumlah Pers Riil',
        type: Number
    })
    @IsNumber()
    jml_pers_riil: number;

    @ApiProperty({
        description: 'Jumlah Kelurahan',
        type: Number
    })
    @IsNumber()
    jml_kel: number;

    @ApiProperty({
        description: 'Jumlah Desa',
        type: Number
    })
    @IsNumber()
    jml_desa: number;

    @ApiProperty({
        description: 'Status Aktif Polda',
        type: Boolean
    })
    @IsBoolean()
    status_aktif: boolean;

    @ApiProperty({
        description: 'Status Aktif Polda',
        type: Number
    })
    provinsi_code: number;

    @ApiProperty({
        description: 'Status Aktif Polda',
        type: Number
    })
    kabupaten_code: number;

    @ApiProperty({
        description: 'Status Aktif Polda',
        type: Number
    })
    kecamatan_code: number;
}
