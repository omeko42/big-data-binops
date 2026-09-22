import { ApiProperty, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStatusDto {
    @ApiProperty({})
    @IsNotEmpty()
    status_name: string;

    @ApiProperty({})
    @IsOptional()
    parent_id: number;
}
