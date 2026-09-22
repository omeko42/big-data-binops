import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OrganisasiLevelAksesDto {
    @ApiProperty()
    @IsNotEmpty()
    level_id: number;

    @ApiProperty()
    @IsNotEmpty()
    akses_level_id: number;
}
