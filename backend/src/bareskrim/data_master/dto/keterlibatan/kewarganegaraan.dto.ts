import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateKewarganegaraanDto {
    @ApiProperty({
        description: 'nama',
        example: 'Laki-laki'
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'code kelamin',
        example: 'l'
    })
    @IsNotEmpty()
    code: string;
}

export class UpdateKewarganegaraanDto {
    @ApiProperty({
        description: 'nama',
        example: 'Laki-laki'
    })
    name: string;

    @ApiProperty({
        description: 'code kelamin',
        example: 'l'
    })
    code: string;
}
