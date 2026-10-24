import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class KategoriLpDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
}
