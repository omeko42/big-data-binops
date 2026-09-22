import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKategoriLokasiDto {
    @ApiProperty({
        description: 'ID of the Crime Type (KategoriLokasi)',
        type: Number
    })
    id: number;

    @ApiProperty({
        description: 'Description of the Crime Type',
        type: String,
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
