import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAgamaDto {
    @ApiProperty({
        description: 'Year for the report',
        example: 'directorate Name'
    })
    @IsNotEmpty()
    name: string;
}
