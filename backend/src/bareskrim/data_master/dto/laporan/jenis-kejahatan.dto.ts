import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateJenisKejahatanDto {
    @ApiProperty({
        description: 'ID of the Crime Type (JenisKejahatan)',
        type: Number
    })
    // @IsNumber()
    // @IsNotEmpty()
    id: number;

    @ApiProperty({
        description: 'Description of the Crime Type',
        type: String,
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty()
    keterangan: string;

    UndangUndang: any;

    @ApiProperty({
        description: 'Is this a street crime?',
        type: Boolean,
        default: false
    })
    @IsBoolean()
    @IsOptional()
    street_crime: boolean;

    @ApiProperty({
        description: 'ID of the SubGolongan Kamtibmas (legacy, sudah tak dipakai UI)',
        type: Number
    })
    // @IsNumber()
    id_sub_golongan: number;

    @ApiProperty({
        description: 'ID Golongan Kejahatan (klasifikasi resmi 4 kode dari DORS)',
        type: Number
    })
    // @IsNumber()
    id_golongan_kejahatan: number;

    @ApiProperty({
        description: 'ID of the ICCS Level-1 category',
        type: Number,
        required: false
    })
    // @IsNumber()
    id_iccs_kategori: number;

    @ApiProperty({
        description: '',
        type: Number
    })
    // @IsNumber()
    id_type_kejahatan: number;

    @ApiProperty({
        description: '',
        type: Number
    })
    // @IsNumber()
    id_kategori_lp: number;

    @ApiProperty({
        description: 'Sort order for the crime type',
        type: Number
    })
    // @IsNumber()
    sort: number;

    @ApiProperty({
        description: 'Attention priority from the leadership',
        type: Number
    })
    // @IsNumber()
    atensi_pimpinan: number;

    @ApiProperty({
        description: 'Crime type number',
        type: String,
        maxLength: 255
    })
    @IsString()
    nomor: string;

    @ApiProperty({
        description: 'Mapping of the crime type to a legal article (optional)',
        type: String,
        maxLength: 255,
        required: false
    })
    @IsString()
    @IsOptional()
    pasal_mapping?: string;

    @ApiProperty({
        description: 'The related law ID (Undang-Undang)',
        type: Number
    })
    // @IsNumber()
    id_uu: any;

    @ApiProperty({
        description: 'The relevant legal article (optional)',
        type: String,
        maxLength: 255,
        required: false
    })
    @IsString()
    @IsOptional()
    pasal?: string;

    @ApiProperty({
        description: 'Is this a prominent crime case?',
        type: Boolean,
        default: false
    })
    @IsBoolean()
    kasus_menojol: boolean;

    @ApiProperty({
        description: 'Is this crime type active?',
        type: Boolean,
        default: true
    })
    @IsBoolean()
    status_aktif: boolean;

    @ApiProperty({
        description: 'Employee ID associated with the crime type (optional)',
        type: Number,
        required: false
    })
    @IsNumber()
    @IsOptional()
    id_emp?: number;

    @ApiProperty({
        description: 'Flag for whether the crime type is prominent (duplicate field)',
        type: Boolean,
        default: false
    })
    @IsBoolean()
    @IsOptional()
    kasus_menonjol?: boolean;
}
