import { ApiProperty, PartialType } from '@nestjs/swagger';
import {  IsNotEmpty, ValidateIf } from 'class-validator';

export class OrganisasiTeamDto {
    @ApiProperty()
    @IsNotEmpty()
    nrp: number;

    @ApiProperty()
    @IsNotEmpty()
    role_id: number;
}
export class OrganisasiUpdateTeamDto {
    @ApiProperty()
    @IsNotEmpty()
    role_id: number;
}