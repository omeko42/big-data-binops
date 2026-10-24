import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGolonganKamtibmasDto {
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
    name: string;
}
