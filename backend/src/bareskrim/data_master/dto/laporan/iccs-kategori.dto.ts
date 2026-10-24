import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateIccsKategoriDto {
    @ApiProperty({
        type: Number
    })
    id: number;

    @ApiProperty({
        description: 'Nomor kategori ICCS Level 1 (1-11)',
        type: Number
    })
    @IsInt()
    kode: number;

    @ApiProperty({
        type: String
    })
    @IsString()
    nama: string;

    @ApiProperty({
        type: String,
        required: false
    })
    @IsString()
    @IsOptional()
    keterangan?: string;
}
