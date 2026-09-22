import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePendidikanDto {
    @ApiProperty({
        description: 'Year for the report',
        example: 'directorate Name'
    })
    @IsNotEmpty()
    name: string;
}
