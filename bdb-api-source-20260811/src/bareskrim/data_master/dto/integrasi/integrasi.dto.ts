import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class IntegrasiDto {
    @ApiPropertyOptional({})
    @IsOptional()
    startDate: string;

    @ApiPropertyOptional({})
    @IsOptional()
    endDate: string;

    @ApiPropertyOptional({})
    @IsOptional()
    polda: string;

    @ApiPropertyOptional({})
    @IsOptional()
    sumber_data: string;
}
