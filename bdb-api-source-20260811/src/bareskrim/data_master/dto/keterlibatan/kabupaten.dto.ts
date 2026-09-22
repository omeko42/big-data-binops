import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateKabupatenDto {
    @ApiProperty({
        description: 'full kombinasi code dengan parent',
        example: '350102'
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
    id_provinsi: number;
}

export class UpdateKabupatenDto {
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
    id_provinsi: number;
}
