import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDesaDto {
    @ApiProperty({
        description: 'code',
        example: '02'
    })
    @IsNotEmpty()
    code: number;

    @ApiProperty({
        example: 'Jakarta'
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '1'
    })
    @IsNotEmpty()
    id_kecamatan: number;
}

export class UpdateDesaDto {
    @ApiProperty({
        description: 'code',
        example: '02'
    })
    code: number;

    @ApiProperty({
        example: 'Jakarta'
    })
    name: string;

    @ApiProperty({
        example: '1'
    })
    id_kecamatan: number;
}
