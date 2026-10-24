import { ApiProperty, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateImportDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Excel file to be uploaded'
    })
    file: any;

    @ApiProperty({
        description: 'Year for the report',
        example: 2024
    })
    // @IsNotEmpty()
    // @IsNumber()
    year: number;

    @ApiProperty({
        example: '2023'
    })
    // @IsNotEmpty()
    sheets_name: string;
}
