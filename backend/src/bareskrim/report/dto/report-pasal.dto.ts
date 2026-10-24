import { ApiProperty, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsInt, IsOptional, IsDateString, IsEmail, IsEnum } from 'class-validator';
import { JenisPasalTerkait } from '../entities/report-pasal.entity';

export class CreateReportPasalDto {
    @ApiProperty({ example: 1 })
    pasal: string;

    @ApiProperty({ example: 1 })
    dan_atau: string;

    @ApiProperty({ example: 1 })
    junto: string;

    @ApiProperty({ example: 1 })
    subsider: string;

    @ApiProperty({ example: 1 })
    jenis_kejahatan_id: number;

    @ApiProperty({ example: 1 })
    undang_undang_id: number;

    @ApiProperty({ example: 2023 })
    @IsOptional()
    report_id?: number;
}

export class UpdateReportPasalDto {
    @ApiProperty({ example: 1 })
    pasal: string;

    @ApiProperty({ example: 1 })
    dan_atau: string;

    @ApiProperty({ example: 1 })
    junto: string;

    @ApiProperty({ example: 1 })
    subsider: string;

    @ApiProperty({ example: 1 })
    jenis_kejahatan_id: number;

    @ApiProperty({ example: 1 })
    undang_undang_id: number;

    @ApiProperty({ example: 2023 })
    @IsOptional()
    report_id?: number;
}
