import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUnitDto {
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
        type: String
    })
    @IsString()
    deskripsi: string;
}
