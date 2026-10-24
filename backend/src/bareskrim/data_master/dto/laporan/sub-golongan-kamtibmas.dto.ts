import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubGolonganKamtibmasDto {
    @ApiProperty({
        type: Number
    })
    id: number;

    @ApiProperty({
        type: String
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: Number
    })
    @IsString()
    golongan_kamptibmas_id: number;
}
