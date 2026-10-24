import { ApiProperty, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsArray, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class DuplicatedReportDto {
    @ApiProperty({
        description: 'Array of IDs',
        example: [1, 2, 3],
        type: [Number]
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    duplicated_report_id: number[];

    @ApiProperty({
        example: 1
    })
    @IsNumber()
    log_import_id: number;
    // @ApiProperty({
    //   description: 'Action to be performed',
    //   example: 'create',
    //   enum: ['create', 'update', 'delete'],
    // })
    // @IsIn(['create', 'update', 'delete'])
    // @IsNotEmpty()
    // action: 'create' | 'update' | 'delete';
}
