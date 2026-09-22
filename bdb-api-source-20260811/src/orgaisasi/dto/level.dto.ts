import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class OrganisasiLevelDto {
    @ApiProperty()
    @IsNotEmpty()
    level_name: string;

    @ApiProperty()
    @IsNotEmpty()
    parent_id: number;
}

export class OrganisasiLevelMenuDto {
    @ApiProperty()
    @IsOptional()
    permission_ids: number[];

    @ApiProperty()
    @IsOptional()
    selection_key: object;
}

export class OrganisasiLevelAksesDto {
    @ApiProperty()
    @IsOptional()
    level_ids: number[];

    @ApiProperty()
    @IsOptional()
    selection_key: object;
}

export class LevelIndexDto {
    @ApiPropertyOptional({ description: 'Number of items per page.' })
    @IsOptional()
    parent_level_id?: number;
}
