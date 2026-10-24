import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateKecamatanDto {
    @ApiProperty({
        description: 'full kombinasi code dengan parent',
        example: '350102'
    })
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
    id_kabupaten: number;
}

export class UpdateKecamatanDto {
    @ApiProperty({
        description: 'full kombinasi code dengan parent',
        example: '350102'
    })
    code: number;

    @ApiProperty({
        example: 'Jakarta'
    })
    name: string;

    @ApiProperty({
        example: '1'
    })
    id_kabupaten: number;
}
