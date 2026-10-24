import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePekerjaanDto {
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

export class UpdatePekerjaanDto {
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
