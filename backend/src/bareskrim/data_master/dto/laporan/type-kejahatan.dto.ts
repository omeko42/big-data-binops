import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTypeKejahatanDto {
    @ApiProperty({
        description: 'Description of the Crime Type',
        type: String,
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
