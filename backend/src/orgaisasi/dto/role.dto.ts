import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class OrganisasiRoleDto {
    @ApiProperty()
    @IsNotEmpty()
    role_name: string;

    // Opsional -- aplikasi ini single-tenant (cuma 1 baris tm_org, "BDB Superadmin"), jadi kalau
    // tak diisi, service otomatis pakai organisasi tunggal yg ada (lihat OrganisasiRoleService.create).
    @ApiProperty({ required: false })
    @IsOptional()
    organisasi_id?: number;
}
export class OrganisasiRoleMenuDto {
    @ApiProperty()
    @IsOptional()
    permission_ids: number[];

    @ApiProperty()
    @IsOptional()
    selection_key: object;
}

