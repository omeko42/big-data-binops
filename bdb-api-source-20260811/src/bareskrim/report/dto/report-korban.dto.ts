import { ApiProperty, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsInt, IsOptional, IsDateString, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReportKorbanDto {
    @ApiProperty({ description: 'Nomor Identitas', example: '123456789' })
    @IsNotEmpty()
    @IsString()
    nomor_identitas?: string;

    @ApiProperty({ description: 'Name of the reporter', example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    nama?: string;

    @ApiProperty({ description: 'Date of birth', example: '1990-01-01' })
    @IsNotEmpty()
    @IsDateString()
    tanggal_lahir?: string;

    @ApiProperty({ description: 'Place of birth', example: 'City, Country' })
    @IsNotEmpty()
    @IsString()
    tempat_lahir?: string;

    @ApiProperty({ description: 'Jenis Kelamin ID', example: 1 })
    @IsNotEmpty()
    jenis_kelamin_id?: number;

    @ApiProperty({ description: 'Tipe Identitas', example: 1 })
    @IsNotEmpty()
    tipe_identitas_id?: number;

    @ApiProperty({ description: 'Agama ID', example: 1 })
    @IsNotEmpty()
    agama_id?: number;

    @ApiProperty({
        description: 'Address of the reporter',
        example: '123 Main St'
    })
    @IsNotEmpty()
    @IsString()
    alamat?: string;

    @ApiProperty({ description: 'Postal code', example: '12345' })
    @IsNotEmpty()
    @IsString()
    kode_pos?: string;

    @ApiProperty({ description: 'Provinsi ID', example: 1 })
    @IsNotEmpty()
    provinsi_id?: number;

    @ApiProperty({ description: 'Kabupaten ID', example: 1 })
    @IsNotEmpty()
    kabupaten_id?: number;

    @ApiProperty({ description: 'Kecamatan ID', example: 1 })
    @IsNotEmpty()
    kecamatan_id?: number;

    @ApiProperty({ description: 'Desa ID', example: 1 })
    @IsNotEmpty()
    desa_id?: number;

    @ApiProperty({ description: 'Mobile number', example: '08123456789' })
    @IsNotEmpty()
    @IsString()
    no_handpone?: string;

    @ApiProperty({ description: 'Telephone number', example: '02123456789' })
    @IsNotEmpty()
    @IsString()
    no_telepon?: string;

    @ApiProperty({
        description: 'Email address',
        example: 'johndoe@example.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email?: string;

    @ApiProperty({ description: 'Kewarganegaraan ID', example: 1 })
    @IsNotEmpty()
    kewarganegaraan_id?: number;

    @ApiProperty({ description: 'Suku ID', example: 1 })
    @IsNotEmpty()
    suku_id?: number;

    @ApiProperty({ description: 'Pekerjaan ID', example: 1 })
    @IsNotEmpty()
    pekerjaan_id?: number;

    @ApiProperty({ description: 'Pendidikan ID', example: 1 })
    @IsNotEmpty()
    pendidikan_id?: number;

    @ApiProperty({ description: 'Social media', example: '@johndoe' })
    @IsOptional()
    @IsString()
    media_sosial?: string;

    @ApiProperty({ description: 'Document', example: 'document.pdf' })
    @IsOptional()
    @IsString()
    dokumen?: string;

    @ApiProperty({ description: 'Report ID', example: 1 })
    @IsNotEmpty()
    report_id?: number;
}

export class UpdateReportKorbanDto {
    @ApiProperty({ description: 'Nomor Identitas', example: '123456789' })
    @IsOptional()
    @IsString()
    nomor_identitas?: string;

    @ApiProperty({ description: 'Name of the reporter', example: 'John Doe' })
    @IsOptional()
    @IsString()
    nama?: string;

    @ApiProperty({ description: 'Date of birth', example: '1990-01-01' })
    @IsOptional()
    @IsDateString()
    tanggal_lahir?: string;

    @ApiProperty({ description: 'Place of birth', example: 'City, Country' })
    @IsOptional()
    @IsString()
    tempat_lahir?: string;

    @ApiProperty({ description: 'Jenis Kelamin ID', example: 1 })
    @IsOptional()
    jenis_kelamin_id?: number;

    @ApiProperty({ description: 'Tipe Identitas', example: 1 })
    @IsOptional()
    tipe_identitas_id?: number;

    @ApiProperty({ description: 'Agama ID', example: 1 })
    @IsOptional()
    agama_id?: number;

    @ApiProperty({
        description: 'Address of the reporter',
        example: '123 Main St'
    })
    @IsOptional()
    @IsString()
    alamat?: string;

    @ApiProperty({ description: 'Postal code', example: '12345' })
    @IsOptional()
    @IsString()
    kode_pos?: string;

    @ApiProperty({ description: 'Provinsi ID', example: 1 })
    @IsOptional()
    provinsi_id?: number;

    @ApiProperty({ description: 'Kabupaten ID', example: 1 })
    @IsOptional()
    kabupaten_id?: number;

    @ApiProperty({ description: 'Kecamatan ID', example: 1 })
    @IsOptional()
    kecamatan_id?: number;

    @ApiProperty({ description: 'Desa ID', example: 1 })
    @IsOptional()
    desa_id?: number;

    @ApiProperty({ description: 'Mobile number', example: '08123456789' })
    @IsOptional()
    @IsString()
    no_handpone?: string;

    @ApiProperty({ description: 'Telephone number', example: '02123456789' })
    @IsOptional()
    @IsString()
    no_telepon?: string;

    @ApiProperty({
        description: 'Email address',
        example: 'johndoe@example.com'
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ description: 'Kewarganegaraan ID', example: 1 })
    @IsOptional()
    kewarganegaraan_id?: number;

    @ApiProperty({ description: 'Suku ID', example: 1 })
    @IsOptional()
    suku_id?: number;

    @ApiProperty({ description: 'Pekerjaan ID', example: 1 })
    @IsOptional()
    pekerjaan_id?: number;

    @ApiProperty({ description: 'Pendidikan ID', example: 1 })
    @IsOptional()
    pendidikan_id?: number;

    @ApiProperty({ description: 'Social media', example: '@johndoe' })
    @IsOptional()
    @IsString()
    media_sosial?: string;

    @ApiProperty({ description: 'Document', example: 'document.pdf' })
    @IsOptional()
    @IsString()
    dokumen?: string;

    @ApiProperty({ description: 'Report ID', example: 1 })
    @IsOptional()
    report_id?: number;
}
