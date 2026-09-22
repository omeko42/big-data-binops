import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

export class OrganisasiDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @ValidateIf(o => o.organisasi_level_key == null)
    @IsNotEmpty()
    organisasi_level_id: number;

    @ApiProperty()
    @ValidateIf(o => o.organisasi_level_id == null)
    @IsNotEmpty()
    organisasi_level_key: object;

    @ApiProperty()
    parent_id: number;
}

export class organisasiKategoriAkses {
    @ApiProperty()
    @IsNotEmpty()
    kategori_id: number;

    @ApiProperty()
    @IsNotEmpty()
    organisasi_id: number;
}

export class OrganisasiJumlahPendudukDto {
    @ApiProperty()
    @IsNotEmpty()
    jumlah_penduduk: number;

    @ApiProperty()
    @IsNotEmpty()
    organisasi_id: number;
}
