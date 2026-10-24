import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGolonganKejahatanDto {
    @ApiProperty({
        description: 'Id Golongan Kejahatan',
        type: Number
    })
    id: number;

    @ApiProperty({
        description: 'Nama Golongan Kejahatan',
        type: String
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
