import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProvinsiDto {
    @ApiProperty({
        description: 'kode',
        example: '02'
    })
    @IsNotEmpty()
    code: number;

    @ApiProperty({
        example: 'Jakarta'
    })
    @IsNotEmpty()
    name: string;
}

export class UpdateProvinsiDto {
    @ApiProperty({
        description: 'kode',
        example: '02'
    })
    code: number;

    @ApiProperty({
        example: 'Jakarta'
    })
    name: string;
}
