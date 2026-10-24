import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateJenisBarangBuktiDto {
    @ApiProperty({
        description: 'Id GolKamTImbmas',
        type: Number
    })
    id: number;

    @ApiProperty({
        description: 'Nama Polda',
        type: String
    })
    @IsString()
    kelompok: string;

    @ApiProperty({
        description: 'Nama Polda',
        type: String
    })
    @IsString()
    satuan: string;

    @ApiProperty({
        description: 'Nama Polda',
        type: String
    })
    @IsString()
    kode: string;

    @ApiProperty({
        description: 'Nama Polda',
        type: String
    })
    @IsString()
    jenis: string;
}
