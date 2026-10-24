import { ApiProperty, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReportDto {
    @ApiProperty({
        description: 'Year for the report',
        example: 1
    })
    @IsNotEmpty()
    log_import_id: number;
}

export class CreateReportStatusDto {
    @ApiProperty({
        description: 'Year for the report',
        example: 'SIDIK'
    })
    @IsNotEmpty()
    status_name: string;

    @ApiProperty({})
    @IsNotEmpty()
    parent_id: number;
}
